'use strict';
import ReactDOM from 'react-dom';
import React from 'react';
import Schedule from './Schedule';

require('bootstrap/scss/bootstrap.scss');
require('font-awesome/scss/font-awesome.scss');
require('../stylesheets/main.sass');


let div = document.createElement('div');
document.body.appendChild(div);
ReactDOM.render(<Schedule />, div);

var css = require("../stylesheets/main.sass");
