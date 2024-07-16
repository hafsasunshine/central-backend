//edited by hafsa

const { Affectation } = require('../model/frames');
const { excelDateToJSDate } = require('../util/date-format');

module.exports = (service, endpoint) => {
  service.post('/affectations', endpoint(async ({ Affectations }, { auth, body }) => {
    const { projects, users } = body;
    console.log('body', body); 

    const affectations = projects.map(project => {
      return users.map(userId => ({
        mobile_user_id: userId,
        city_name: project[0] || '',
        local_area_name: project[1] || '',
        street_name: project[2] || '',
        project_code: project[3] || '',
        property_name: project[4] || '',
        property_longitude: project[5] !== undefined ? project[5] : null,
        property_latitude: project[6] !== undefined ? project[6] : null,
        property_type: project[7] || '',
        apartment_name: project[8] || '',
        co_name: project[9] || '',
        olt_name: project[10] || '',
        olt_slot_no: project[11] !== undefined ? project[11] : null,
        olt_port_no: project[12] !== undefined ? project[12] : null,
        prestataire: project[13] || '',
        date_de_declaration: project[14] !== undefined ? excelDateToJSDate(project[14]) : null,
        potentiel: project[15] !== undefined ? project[15] : null,
        typologie: project[16] || ''
      }));
    }).flat();

    console.log('Mapped affectations:', affectations);

    try {
      const createdAffectations = await Promise.all(
        affectations.map(async (affectation) => {
          console.log('Creating affectation:', affectation);
          return await Affectations.create(Affectation.fromApi(affectation));
        })
      );

      return createdAffectations;
    } catch (error) {
      console.error('Error creating affectation:', error);
      throw error;
    }
  }));
};