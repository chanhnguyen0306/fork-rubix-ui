package storage

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/NubeIO/lib-uuid/uuid"
	"github.com/NubeIO/rubix-ui/backend/store"
	log "github.com/sirupsen/logrus"
	"github.com/tidwall/buntdb"
)

const ReleasePrefix = "rel"

func (inst *db) AddRelease(body *store.Release) (*store.Release, error) {
	rel, _ := inst.GetReleaseByVersion(body.Release)
	if rel != nil {
		err := inst.DeleteRelease(rel.Uuid)
		if err != nil {
			return nil, err
		}
	}
	body.Uuid = uuid.ShortUUID(ReleasePrefix)
	data, err := json.Marshal(body)
	if err != nil {
		log.Error(err)
		return nil, err
	}
	err = inst.DB.Update(func(tx *buntdb.Tx) error {
		_, _, err := tx.Set(body.Uuid, string(data), nil)
		return err
	})
	if err != nil {
		log.Error(err)
		return nil, err
	}
	return body, nil
}

func (inst *db) GetReleases() ([]store.Release, error) {
	var resp []store.Release
	err := inst.DB.View(func(tx *buntdb.Tx) error {
		err := tx.Ascend("", func(key, value string) bool {
			var data store.Release
			err := json.Unmarshal([]byte(value), &data)
			if err != nil {
				return false
			}
			if matchReleaseUUID(data.Uuid) {
				resp = append(resp, data) // put into array
			}
			return true
		})
		return err
	})
	if err != nil {
		log.Error(err)
		return []store.Release{}, err
	}
	return resp, nil
}

func (inst *db) GetRelease(uuid string) (*store.Release, error) {
	if matchReleaseUUID(uuid) {
		var data *store.Release
		err := inst.DB.View(func(tx *buntdb.Tx) error {
			val, err := tx.Get(uuid)
			if err != nil {
				return err
			}
			err = json.Unmarshal([]byte(val), &data)
			if err != nil {
				return err
			}
			return nil
		})
		if err != nil {
			log.Error(err)
			return nil, err
		}
		return data, nil
	} else {
		return nil, errors.New(fmt.Sprintf("uuid %s doesn't exist", uuid))
	}
}

func (inst *db) GetReleaseByVersion(version string) (*store.Release, error) {
	releases, err := inst.GetReleases()
	if err != nil {
		return nil, err
	}
	for _, release := range releases {
		if release.Release == version {
			return &release, err
		}
	}
	return nil, err
}

func (inst *db) DeleteRelease(uuid string) error {
	if matchReleaseUUID(uuid) {
		err := inst.DB.Update(func(tx *buntdb.Tx) error {
			_, err := tx.Delete(uuid)
			return err
		})
		if err != nil {
			log.Error(err)
			return err
		}
		return nil
	}
	return errors.New(fmt.Sprintf("uuid %s doesn't exist", uuid))
}

func (inst *db) DeleteReleases() error {
	releases, err := inst.GetReleases()
	if err != nil {
		return err
	} else {
		for _, release := range releases {
			err = inst.Delete(release.Uuid)
			if err != nil {
				return err
			}
		}
	}
	return nil
}
