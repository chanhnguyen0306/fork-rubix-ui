package rumodel

type Arch struct {
	Arch string `json:"arch"`
}

type ProductType string

const (
	RubixCompute   ProductType = "rubix-compute"
	RubixComputeIO ProductType = "rubix-compute-io"
	RubixCompute5  ProductType = "rubix-compute-5"
	Edge28         ProductType = "edge28"
	Cloud          ProductType = "cloud"
	Nuc            ProductType = "nuc"
	AllLinux       ProductType = "all-linux"
	Mac            ProductType = "mac"
	None           ProductType = "none"
)

func (c ProductType) String() string {
	return string(c)
}
