const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Company = require('./model/companies')
const bodyParser = require('body-parser')
const request = require('request')
var rp = require('request-promise');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
// const path = require('path');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const url = 'mongodb://devmini:office123@ds123796.mlab.com:23796/minitestmongo'

// connect to MongoDB
mongoose.connect(url)
// var db = mongoose.connection

app.get('/', function (req, res) {
  return res.status(200).json({
    status: 'fail',
    message: 'Fetch Failed'
  })
})

/**
 * get a companies
 *
 */
app.get('/api/company', (req, res) => {
  mongoose.connect(url, function (err) {
    if (err) throw err
    Company.find({}, 'symbol', function (err, company) {
      if (err) throw err
      if (company.length > 0) {
        let processedData = []
        company.forEach(function (element) {
          processedData.push(element.symbol)
        })
        return res.status(200).json({
          status: 'success',
          data: {
            'company': processedData
          }
        })
      } else {
        return res.status(200).json({
          status: 'fail',
          message: 'Fetch Failed'
        })
      }
    })
  })
})

app.get('/api/scrapcontent', (req, res) => {
  let url = 'https://api.iextrading.com/1.0/stock/'+req.query.searchtext.toUpperCase()+'/company'
  let yahoourl = 'https://in.finance.yahoo.com/quote/'+req.query.searchtext.toUpperCase()+'?p='+req.query.searchtext.toUpperCase() 
  request(url, function (err, response, body) {
    if(err){
      return res.status(200).json({
        status: 'fail',
        message: 'Fetch Failed'
      })
    } else {
      let responsedata = JSON.parse(body)
      puppeteer
      .launch()
      .then(function(browser) {
        return browser.newPage();
      })
      .then(function(page) {
        return page.goto(yahoourl, {timeout: 0, waitUntil: 'domcontentloaded'}).then(function() {
          return page.content();
        });
      })
      .then(function(html) {
        dataValue = html;
        let industry = html.match(/"industry":("[a-zA-Z \- !@#$%^&*()\+=]+")/);
        let sector = html.match(/"sector":("[a-zA-Z ]+")/i);
        if(industry){
          industry = industry[1]
        } else{
          industry = 'Not Able to Scrap industry'
        }
        if(sector){
          sector = sector[1]
        } else{
          sector = 'Not Able to Scrap sector'
        }
        return res.status(200).json({
          status: 'success',
          data: { sector: sector, industry: industry, responsedata: responsedata }
        })
      })
      .catch(function(err) {
        console.log(err)
      });
    }
  });
})


app.get('/api/symbol', (req, res) => {
  mongoose.connect(url, function (err) {
    if (err) throw err
    Company.find({ symbol: { $regex: '.*' + req.query.searchtext.toUpperCase() + '.*' } }, 'symbol', function (err, company) {
      if (err) throw err
      if (company.length) {
        let processedData = []
        company.forEach(function (element) {
          processedData.push(element.symbol)
        })
        return res.status(200).json({
          status: 'success',
          data: { 'company': processedData }
        })
      } else {
        return res.status(200).json({
          status: 'fail',
          message: 'Fetch Failed'
        })
      }
    })
  })
})

/**
 * Add a companies
 *
 */
app.get('/api/add/companies', (req, res) => {
  mongoose.connect(url, function (err) {
    if (err) throw err
    let crawlurl = 'https://api.iextrading.com/1.0/ref-data/symbols'
    request(crawlurl, function (errData, response, body) {
      if (errData) {
        return res.status(200).json({
          status: false,
          message: 'Error Occured!'
        })
      } else {
        let responsedata = JSON.parse(body)
        responsedata.forEach(function (element) {
          var company = new Company()
          company.symbol = element.symbol
          company.name = element.name
          company.isEnabled = element.isEnabled
          company.type = element.type
          company.save()
        })
        return res.status(200).json({
          status: true,
          message: 'Success'
        })
      }
    })
  })
})

app.listen(3000, () => console.log('server running on port http://localhost:3000!'))
