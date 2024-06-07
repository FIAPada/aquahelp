package main

import (
	"aquahelp/gandalf/models"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var secretKey = []byte("ABUBLEEEEEE")

type LoginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Claims struct {
	Username string  `json:"username"`
	UserID   float64 `json:"userID"`
}

func createToken(email string, userID float64) (string, error) {
	claims := &Claims{
		Username: email,
		UserID:   userID,
	}
	claimsJSON, err := json.Marshal(claims)
	if err != nil {
		return "", err
	}
	claimsBase64 := base64.RawURLEncoding.EncodeToString(claimsJSON)

	// Create the signature
	h := hmac.New(sha256.New, secretKey)
	h.Write([]byte(claimsBase64))
	signature := base64.RawURLEncoding.EncodeToString(h.Sum(nil))

	// Combine the claims and signature to form the token
	token := strings.Join([]string{claimsBase64, signature}, ".")

	return token, nil
}

func verifyToken(tokenString string) (*Claims, error) {
	tokenParts := strings.Split(tokenString, ".")
	if len(tokenParts) != 2 {
		return nil, errors.New("invalid token format")
	}

	claimsBase64 := tokenParts[0]
	signature := tokenParts[1]

	// Verify the signature
	h := hmac.New(sha256.New, secretKey)
	h.Write([]byte(claimsBase64))
	expectedSignature := base64.RawURLEncoding.EncodeToString(h.Sum(nil))
	if signature != expectedSignature {
		return nil, errors.New("invalid token signature")
	}

	// Decode the claims
	claimsJSON, err := base64.RawURLEncoding.DecodeString(claimsBase64)
	if err != nil {
		return nil, errors.New("failed to decode token claims")
	}

	var claims Claims
	err = json.Unmarshal(claimsJSON, &claims)
	if err != nil {
		return nil, errors.New("failed to unmarshal token claims")
	}

	return &claims, nil
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
	dsn := "root:root@tcp(localhost:3306)/aquahelp?charset=utf8mb4&parseTime=True&loc=Local"
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

	var existingUser models.User
	db.Model(&models.User{}).Where("email = ?", user.Email).First(&existingUser)
	if existingUser.ID != 0 {
		return echo.ErrBadRequest
	}

	hashedPassword, err := hashPassword(user.Password)
	if err != nil {
		return echo.ErrInternalServerError
	}

	user.Password = hashedPassword
	db.Create(&user)

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

	if !checkPassword(loginPayload.Password, user.Password) {
		return echo.ErrUnauthorized
	}

	token, err := createToken(user.Email, float64(user.ID))
	if err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, map[string]string{"token": token})
}

func verifyEndpoint(c echo.Context) error {
	token := c.Request().Header.Get("Authorization")
	if token == "" {
		return echo.ErrUnauthorized
	}

	_, err := verifyToken(token)
	if err != nil {
		return echo.ErrUnauthorized
	}

	return c.JSON(http.StatusOK, "verified!")
}

func main() {
	db, err := connectDB()
	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&models.User{})

	e := echo.New()
	e.Use(middleware.CORS())
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello from gandalf!")
	})
	e.POST("/register", registerUser)
	e.POST("/login", loginUser)
	e.GET("/verify", verifyEndpoint)
	e.Logger.Fatal(e.Start(":8000"))
}
