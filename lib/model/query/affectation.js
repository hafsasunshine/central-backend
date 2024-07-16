//file created by hafsa
const { sql } = require('slonik');
const { Affectation } = require('../frames');

// Define the create method
const create = (affectation) => async ({ run }) => {
  // Extract fields to ensure only the necessary ones are passed
  const {
    mobile_user_id,
    city_name,
    local_area_name,
    street_name,
    project_code,
    property_name,
    property_longitude,
    property_latitude,
    property_type,
    apartment_name,
    co_name,
    olt_name,
    olt_slot_no,
    olt_port_no,
    prestataire,
    date_de_declaration,
    potentiel,
    typologie
  } = affectation;

  // Convert olt_slot_no and olt_port_no to numbers instead of strings
  const longitude = Number(property_longitude);
  const latitude = Number(property_latitude);
  const slot = Number(olt_slot_no);
  const port = Number(olt_port_no);

  console.log('Affectation before SQL:', affectation);

  const query = sql`
    INSERT INTO affectation (
      mobile_user_id, city_name, local_area_name, street_name, project_code,
      property_name, property_longitude, property_latitude, property_type,
      apartment_name, co_name, olt_name, olt_slot_no, olt_port_no, prestataire,
      date_de_declaration, potentiel, typologie
    ) VALUES (
      ${mobile_user_id}, ${city_name}, ${local_area_name}, ${street_name}, ${project_code},
      ${property_name}, ${longitude}, ${latitude}, ${property_type},
      ${apartment_name}, ${co_name}, ${olt_name}, ${slot}, ${port}, ${prestataire},
      ${date_de_declaration}, ${potentiel}, ${typologie}
    ) RETURNING *;
  `;

  console.log('Executing query:', query.sql);
  console.log('Query values:', query.values);

  // try {
  //   const result = await run(query);

  //   if (!result || !result.rows || result.rows.length === 0) {
  //     throw new Error('Insertion failed: no rows returned.');
  //   }

  //   console.log('Affectation after SQL:', result.rows[0]);
  //   return new Affectation(result.rows[0]);
  // } catch (error) {
  //   console.error('Error creating affectation:', error.message);
  //   throw error; // Re-throw the error after logging it
  // }
  run(query);
}; 
module.exports = { create };