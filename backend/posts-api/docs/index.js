const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const Swagger = require("../handler/swagger");
const user = require("./api/index");

class ApiDocs {
  #apiDocOption;
  #swagger;

  constructor() {
    this.#apiDocOption = {
      ...user,
    };

    this.#swagger = new Swagger();
  }

  init() {
    this.#swagger.addAPI(this.#apiDocOption);
  }

  getSwaggerOption() {
    const { apiOption, setUpoption } = this.#swagger.getOption();
    const specs = swaggerJsDoc(apiOption);

    return {
      swaggerUi,
      specs,
      setUpoption,
    };
  }
}

module.exports = ApiDocs;
