package main

import (
	"database/sql"
	"net/http"

	"github.com/labstack/echo/v4"
)

type User struct {
	ID       uint64 `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"` // This should be hashed securely in production
}

func connectDB() (*sql.DB, error) {
	// Replace with your connection details
	dsn := "user:password@tcp(localhost:3306)/database_name?charset=utf8"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}
	return db, nil
}

func registerUser(c echo.Context) error {
	db, err := connectDB()
	if err != nil {
		return err
	}
	defer db.Close()

	var user User
	if err := c.Bind(&user); err != nil {
		return echo.ErrBadRequest
	}

	// Hash password before storing (not implemented here)

	stmt, err := db.Prepare("INSERT INTO users (username, password) VALUES (?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(user.Username, user.Password)
	if err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusCreated, map[string]string{"message": "User created successfully"})
}

func loginUser(c echo.Context) error {
	db, err := connectDB()
	if err != nil {
		return err
	}
	defer db.Close()

	var credentials struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := c.Bind(&credentials); err != nil {
		return echo.ErrBadRequest
	}

	var user User
	row := db.QueryRow("SELECT * FROM users WHERE username = ?", credentials.Username)
	err = row.Scan(&user.ID, &user.Username, &user.Password)
	if err == sql.ErrNoRows {
		return echo.ErrUnauthorized
	} else if err != nil {
		return echo.ErrInternalServerError
	}

	// Validate password hash (not implemented here)

	if credentials.Password != user.Password { // This should be secure password comparison
		return echo.ErrUnauthorized
	}

	// Generate and return JWT token (not implemented here)

	return c.JSON(http.StatusOK, map[string]string{"message": "Login successful"})
}

func main() {
	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello from gandalf!")
	})
	e.POST("/register", registerUser)
	e.POST("/login", loginUser)
	e.Logger.Fatal(e.Start(":8000"))
}
