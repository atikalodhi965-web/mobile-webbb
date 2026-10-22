const DeviceType = require('../../models/DeviceType');
const Brand = require('../../models/Brand');
const DeviceModel = require('../../models/DeviceModel');
const createCrudController = require('../../services/crudFactory');

const deviceTypeAdmin = createCrudController(DeviceType, {
  resourceName: 'DeviceType',
  slugSource: 'title',
  searchFields: ['title', 'slug', 'description'],
});

const brandAdmin = createCrudController(Brand, {
  resourceName: 'Brand',
  slugSource: 'name',
  searchFields: ['name', 'slug', 'description'],
  populate: ['deviceTypeIds'],
});

const deviceModelAdmin = createCrudController(DeviceModel, {
  resourceName: 'DeviceModel',
  slugSource: 'name',
  searchFields: ['name', 'slug', 'modelNumber', 'categoryGroup'],
  populate: ['brandId', 'deviceTypeId'],
});

module.exports = { deviceTypeAdmin, brandAdmin, deviceModelAdmin };
