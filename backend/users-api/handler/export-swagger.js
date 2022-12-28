const ApiDcos = require("../docs/index");

function getSwaggerOption() {
  const apiDocs = new ApiDcos();
  apiDocs.init();

  return apiDocs.getSwaggerOption();
}

const { swaggerUi, specs, setUpoption } = getSwaggerOption();

module.exports = {
  swaggerUi,
  specs,
  setUpoption,
};
