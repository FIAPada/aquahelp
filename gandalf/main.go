package main

import (
	"aquahelp/gandalf/models"
	"net/http"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type LoginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func hashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func checkPassword(password, hashedPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}

func connectDB() (*gorm.DB, error) {
	dsn := "root:root@tcp(127.0.0.1:3306)/aquahelp?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return db, nil
}

func registerUser(c echo.Context) error {
	db, err := connectDB()
	if err != nil {
		return err
	}

	var user models.User
	if err := c.Bind(&user); err != nil {
		return echo.ErrBadRequest
	}

	hashedPassword, err := hashPassword(user.Password)
	if err != nil {
		return echo.ErrInternalServerError
	}

	user.Password = hashedPassword
	db.Create(user)

	return c.JSON(http.StatusCreated, map[string]string{"message": "User created successfully"})
}

func loginUser(c echo.Context) error {
	db, err := connectDB()
	if err != nil {
		return err
	}

	var loginPayload LoginPayload
	if err := c.Bind(&loginPayload); err != nil {
		return echo.ErrBadRequest
	}

	var user models.User
	db.Model(&models.User{}).Where("email = ?", loginPayload.Email).First(&user)

	// validate password
	if !checkPassword(loginPayload.Password, user.Password) {
		return echo.ErrUnauthorized
	}
	// Generate and return JWT token
	// token, err := generateJWTToken(user)
	// if err != nil {
	// 	return echo.ErrInternalServerError
	// }

	return c.JSON(http.StatusOK, map[string]string{"message": "Login successful"})
}

func main() {
	db, err := connectDB()
	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&models.User{})

	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello from gandalf!")
	})
	e.POST("/register", registerUser)
	e.POST("/login", loginUser)
	e.Logger.Fatal(e.Start(":8000"))
}
