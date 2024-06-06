package main

import (
	"aquahelp/snitch/models"
	"net/http"

	"github.com/labstack/echo/v4"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func connectDB() (*gorm.DB, error) {
	dsn := "root:root@tcp(127.0.0.1:3306)/aquahelp?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return db, nil
}

func createAnimalReport(c echo.Context) error {
	db, err := connectDB()
	if err != nil {
		return c.String(http.StatusInternalServerError, "failed to connect to database")
	}

	var report models.AnimalReport
	if err := c.Bind(&report); err != nil {
		return c.String(http.StatusBadRequest, "failed to bind request body")
	}

	if err := db.Create(&report).Error; err != nil {
		return c.String(http.StatusInternalServerError, "failed to create report")
	}

	return c.String(http.StatusCreated, "report created")
}

func createPollutionReport(c echo.Context) error {
	db, err := connectDB()
	if err != nil {
		return c.String(http.StatusInternalServerError, "failed to connect to database")
	}

	var report models.PollutionReport
	if err := c.Bind(&report); err != nil {
		return c.String(http.StatusBadRequest, "failed to bind request body")
	}

	if err := db.Create(&report).Error; err != nil {
		return c.String(http.StatusInternalServerError, "failed to create report")
	}

	return c.String(http.StatusCreated, "report created")
}

func main() {
	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello from snitch!")
	})

	e.POST("/animal_report", createAnimalReport)
	e.POST("/pollution_report", createPollutionReport)

	e.Logger.Fatal(e.Start(":8000"))
}
