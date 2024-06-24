// Copyright 2018 ODK Central Developers
// See the NOTICE file at the top-level directory of this distribution and at
// https://github.com/getodk/central-backend/blob/master/NOTICE.
// This file is part of ODK Central. It is subject to the license terms in
// the LICENSE file found in the top-level directory of this distribution and at
// https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
// including this file, may be copied, modified, propagated, or distributed
// except according to the terms contained in the LICENSE file.

//edited by hafsa
const { FieldKey } = require('../model/frames');
const { getOrNotFound } = require('../util/promise');
const { success } = require('../util/http');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const { mailer } = require ('../external/mail');
const { messages } = require ('../formats/mail');
const config = require('config');
const { mergeRight } = require('ramda');

module.exports = (service, endpoint) => {

  service.get('/projects/:projectId/app-users', endpoint(({ FieldKeys, Projects }, { auth, params, queryOptions }) =>
    Projects.getById(params.projectId)
      .then(getOrNotFound)
      .then((project) => auth.canOrReject('field_key.list', project))
      .then((project) => FieldKeys.getAllForProject(project, queryOptions))));

//edited by hafsa
  service.post('/projects/:projectId/app-users', endpoint(({ FieldKeys, Projects }, { auth, body, params }) =>
    Projects.getById(params.projectId)
      .then(getOrNotFound)
      .then((project) => auth.canOrReject('field_key.create', project))
      .then(async (project) => {

        //generate the password
        const password = crypto.randomBytes(8).toString('hex');
        
        //retieve environment variables
        const env = config.get('default.env');

        //create mail tramsport options
        const mailOptions = mergeRight(config.get('default.email'), { env });

        //create mailer instance
        const mail = mailer(mailOptions);
        //send the mail 
        try {
          await mail(body.displayName, 'passwordEmail', {password});
          console.log('display name',body.displayName);
        }catch (error){
          console.log('error sending email', error);
          throw error;
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const fk = FieldKey.fromApi({
          ...body,
          password: hashedPassword
        }).with({ createdBy: auth.actor.map((actor) => actor.id).orNull() });
        return FieldKeys.create(fk, project);
      })
));

  service.delete('/projects/:projectId/app-users/:id', endpoint(({ Actors, FieldKeys, Projects }, { auth, params }) =>
    Projects.getById(params.projectId)
      .then(getOrNotFound)
      .then((project) => auth.canOrReject('field_key.delete', project))
      .then((project) => FieldKeys.getByProjectAndActorId(project.id, params.id))
      .then(getOrNotFound)
      .then((fk) => Actors.del(fk.actor))
      .then(success)));

};

