/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var mongoose = require('mongoose');
var mongooseConfig = require('../config/mongoose_config');
require('dotenv').config();
var CONNECTION_STRING = process.env.MONGO_DB;
var { Project } = require('../models/Project');
var { ObjectId } = require('mongodb');

mongoose.connect(CONNECTION_STRING, mongooseConfig);

module.exports = app => {
  app.get('/api/issues/:project', (req, res, next) => {
    var { project } = req.params;
    Project.findOne({ project }, (err, projectName) => {
      if (err) next(err);
      if (!projectName) return res.status(400).send(`Unknown Project: ${project}`);
      let issueArray = projectName.issues;
      for (let filter in req.query) {
        if (filter !== 'open') issueArray = issueArray.filter(issue => issue[filter] === req.query[filter]);
        else issueArray = issueArray.filter(issue => issue[filter] === (req.query[filter] === 'true'));
      }
      return res.status(200).send(issueArray);
    });
  });
    
  app.post('/api/issues/:project', (req, res, next) => {
    var { project } = req.params;
    var { issue_title, issue_text, created_by } = req.body;
    var assigned_to = req.body.assigned_to ? req.body.assigned_to : "";
    var status_text = req.body.status_text ? req.body.status_text : "";
    var { created_on, updated_on } = { created_on: new Date(), updated_on: new Date() };
    var { _id, open } = { _id: ObjectId().toString(), open: true };
    var issue = { _id, issue_title, issue_text, created_on, updated_on, created_by, assigned_to, open, status_text };
    var newProject = new Project({ project });
    if (!issue_title|!issue_text|!created_by) return res.status(200).send('missing inputs');
    Project.findOne({ project }, (err, projectName) => {
      if (err) next(err);
      if (projectName) {
        projectName.issues.push(issue);
        projectName.save((err, updatedProject) => {
          if (err) next(err);
          return res.status(200).json(updatedProject.issues[updatedProject.issues.length -1]);
        });
      } else {
        newProject.issues.push(issue);
        newProject.save((err, createdProject) => {
          if (err) next(err);
          return res.status(200).json(createdProject.issues[createdProject.issues.length -1]);
        });
      };
    });
  });
    
  app.put('/api/issues/:project', (req, res, next) => {
    var { project } = req.params;
    var { _id } = req.body;
    Project.findOne({ project }, (err, projectName) => {
      if (err) next(err);
      if (!projectName) return res.status(400).send(`Unknown Project: ${project}`);
      var issueIndex = projectName.issues.findIndex(issue => issue._id === _id);
      var issueToUpdate = projectName.issues[issueIndex];
      if (!issueToUpdate) return res.status(400).send('No update field sent');
      for (let field in req.body) {
        if (field !== 'open' && field !== '_id') issueToUpdate[field] = req.body[field];
        else if (field === 'open') issueToUpdate[field] = (req.body[field] === 'true');
      }
      issueToUpdate.updated_on = new Date();
      projectName.markModified('issues');
      projectName.save((err, updatedProject) => {
        if (err) res.status(400).send(`could not update ${_id}`), next(err);
        return res.status(200).send('successfully updated');
      });
    });
  });
    
  app.delete('/api/issues/:project', (req, res, next) => {
    var { project } = req.params;
    var { _id } = req.body;
    if (!_id) return res.status(400).send('_id error');
    Project.findOne({ project }, async (err, projectName) => {
      if (err) next(err);
      if (!projectName) return res.status(400).send(`Unkown Project: ${project}`);
      var issueIndex = projectName.issues.findIndex(issueToRemove => issueToRemove._id === _id);
      var issueToRemove = projectName.issues[issueIndex];
      var issuesLength = projectName.issues.length;
      projectName.issues.remove(issueToRemove);
      projectName.markModified('issues');
      projectName.save((err, updatedProject) => {
        if (err) next(err);
        if (projectName.issues.length === issuesLength) return res.status(400).send(`could not delete ${_id}`);
        else return res.status(200).send(`deleted ${_id}`);
      });
    });
  });
};