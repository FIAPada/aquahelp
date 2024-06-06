package main

import (
	"aquahelp/snitch/models"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/minio/minio-go"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

const (
	minioEndpoint = "localhost:9000"
	minioAccess   = "minio"
	minioSecret   = "minio"
)

func connectMinio() (*minio.Client, error) {
	client, err := minio.New(minioEndpoint, minioAccess, minioSecret, false)
	if err != nil {
		return nil, err
	}

	return client, nil
}

func connectDB() (*gorm.DB, error) {
	dsn := "root:root@tcp(127.0.0.1:3306)/aquahelp?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return db, nil
}

func createAnimalReport(c echo.Context) error {
	minioClient, err := connectMinio()
	if err != nil {
		return c.String(http.StatusInternalServerError, "failed to connect to minio")
	}

	db, err := connectDB()
	if err != nil {
		return c.String(http.StatusInternalServerError, "failed to connect to database")
	}

	var report models.AnimalReport
	report.AddressNumber = c.FormValue("address_number")
	report.City = c.FormValue("city")
	report.Province = c.FormValue("province")
	report.ReferencePoint = c.FormValue("reference_point")
	report.ReportedAt = c.FormValue("reported_at")
	report.StreetName = c.FormValue("street_name")
	if err := db.Create(&report).Error; err != nil {
		return c.String(http.StatusInternalServerError, "failed to create report")
	}

	file, err := c.FormFile("image")
	if err != nil {
		return c.String(http.StatusBadRequest, "failed to get image")
	}

	if file.Size > 1024*1024*15 {
		return c.String(http.StatusBadRequest, "image size too large")
	}

	fileName := fmt.Sprint(report.ID) + ".jpg"
	filePath := "animal_reports/" + fileName
	if _, err := minioClient.FPutObject("aquahelp", file.Filename, filePath, minio.PutObjectOptions{ContentType: "image/jpeg"}); err != nil {
		return c.String(http.StatusInternalServerError, "failed to upload image")
	}

	return c.String(http.StatusCreated, "report created")
}

func createPollutionReport(c echo.Context) error {
	minioClient, err := connectMinio()
	if err != nil {
		return c.String(http.StatusInternalServerError, "failed to connect to minio")
	}

	db, err := connectDB()
	if err != nil {
		return c.String(http.StatusInternalServerError, "failed to connect to database")
	}

	var report models.PollutionReport
	report.AddressNumber = c.FormValue("address_number")
	report.City = c.FormValue("city")
	report.Province = c.FormValue("province")
	report.ReferencePoint = c.FormValue("reference_point")
	report.ReportedAt = c.FormValue("reported_at")
	report.StreetName = c.FormValue("street_name")
	if err := db.Create(&report).Error; err != nil {
		return c.String(http.StatusInternalServerError, "failed to create report")
	}

	file, err := c.FormFile("image")
	if err != nil {
		return c.String(http.StatusBadRequest, "failed to get image")
	}

	if file.Size > 1024*1024*15 {
		return c.String(http.StatusBadRequest, "image size too large")
	}

	fileName := fmt.Sprint(report.ID) + ".jpg"
	filePath := "pollution_reports/" + fileName
	if _, err := minioClient.FPutObject("aquahelp", file.Filename, filePath, minio.PutObjectOptions{ContentType: "image/jpeg"}); err != nil {
		return c.String(http.StatusInternalServerError, "failed to upload image")
	}

	return c.String(http.StatusCreated, "report created")
}

func main() {
	minio, err := connectMinio()
	if err != nil {
		panic(err)
	}

	if err := minio.MakeBucket("aquahelp", "us-east-1"); err != nil {
		exists, errBucketExists := minio.BucketExists("aquahelp")
		if errBucketExists == nil && exists {
			println("We already own 'aquahelp' bucket")
		} else {
			panic(err)
		}
	}

	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello from snitch!")
	})

	e.POST("/animal_report", createAnimalReport)
	e.POST("/pollution_report", createPollutionReport)

	e.Logger.Fatal(e.Start(":8000"))
}
