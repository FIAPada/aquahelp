package models

import "gorm.io/gorm"

type AnimalReport struct {
	gorm.Model
	AddressNumber  string `json:"address_number"`
	City           string `json:"city"`
	Location       string `json:"location"`
	Province       string `json:"province"`
	ReferencePoint string `json:"reference_point"`
	ReportedAt     string `json:"reported_at"`
	StreetName     string `json:"street_name"`
}

type PollutionReport struct {
	gorm.Model
	AddressNumber  string `json:"address_number"`
	City           string `json:"city"`
	Location       string `json:"location"`
	Province       string `json:"province"`
	ReferencePoint string `json:"reference_point"`
	ReportedAt     string `json:"reported_at"`
	StreetName     string `json:"street_name"`
}
