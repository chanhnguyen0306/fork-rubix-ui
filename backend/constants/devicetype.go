package constants

type DeviceType int64

const (
	Cloud DeviceType = iota
	Edge28
	RubixCompute
	RubixCompute5
	RubixComputeIO
)

func (s DeviceType) String() string {
	switch s {
	case Cloud:
		return "cloud"
	case Edge28:
		return "edge-28"
	case RubixCompute:
		return "rubix-compute"
	case RubixCompute5:
		return "rubix-compute-5"
	case RubixComputeIO:
		return "rubix-compute-io"
	}
	return "unknown"
}
