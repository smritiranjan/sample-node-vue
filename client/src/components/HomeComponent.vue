<template>
  <div class="hello">
    <div class="box">
      <md-toolbar class="md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <md-button class="md-icon-button">
              <md-icon>menu</md-icon>
            </md-button>
          </div>
          <md-autocomplete
            class="search"
            v-model="search"
            :md-options="symbols"
            md-layout="box"
            name="search"
            :debounce="2000"
            :md-open-on-focus="false">
            <label>Search...</label>
          </md-autocomplete>
          <div class="md-toolbar-section-end">
            <md-button v-on:click="processForm" type="submit" class="md-icon-button">
              <md-icon>search</md-icon>
            </md-button>
            <md-button  class="md-icon-button">
              <md-icon>more_vert</md-icon>
            </md-button>
          </div>
        </div>
      </md-toolbar>
       <div class="content">
          <div  v-if="loader" class="loader">
            <md-progress-spinner :md-diameter="100" :md-stroke="6" md-mode="indeterminate"></md-progress-spinner>
          </div>
          <div v-if="company">
            <md-card class="md-card-example">
              <md-card-area md-inset>
                <md-card-media md-ratio="16:9">
                  <img v-bind:src="logo.url">
                </md-card-media>
                <md-card-header>
                  <div class="md-title">{{company.companyName}}</div>
                  <div class="md-subhead">{{company.symbol}}</div>
                </md-card-header>
                <md-card-content>
                  <a v-bind:href="company.website">{{company.website}}</a>
                </md-card-content>
                <md-card-content>
                  Industry : {{company.industry}}
                </md-card-content>
              </md-card-area>
              <md-card-content>
                <h3 class="md-subheading">Price (last price) of the stock</h3>
                <div class="card-reservation">
                  <md-icon>monetization_on</md-icon>
                  <div class="md-button-group">
                    <md-button>{{quote.latestPrice}}</md-button>
                  </div>
                </div>
              </md-card-content>
              <md-card-content>
                <h3 class="md-subheading">Close Price (last price) of the stock</h3>
                <div class="card-reservation">
                  <md-icon>monetization_on</md-icon>
                  <div class="md-button-group">
                    <md-button>{{quote.close}}</md-button>
                  </div>
                </div>
              </md-card-content>
            </md-card>
            <md-card class="md-card-example">
              <md-card-header>
                <div class="md-title">Update News</div>
              </md-card-header>
              <md-card-content v-for="value in news" :key="value.datetime">
                <span>{{ value.headline }}</span>
                  <p>{{ value.datetime }}</p>
              </md-card-content>
            </md-card>
            <md-card class="md-card-example">
              <md-card-header>
                <div class="md-title">Price Change History</div>
              </md-card-header>
              <md-card-content>
                <h3 class="md-subheading">The price 1 month ago</h3>
                <div class="card-reservation">
                  <div class="md-button-group">
                    <md-button>{{firstMonth}} [change {{firstPercentage}}%]</md-button>
                  </div>
                </div>
              </md-card-content>
              <md-card-content>
                <h3 class="md-subheading">The price 3 months ago</h3>
                <div class="card-reservation">
                  <div class="md-button-group">
                    <md-button>{{thirdMonth}} [change {{thirdPercentage}}%]</md-button>
                  </div>
                </div>
              </md-card-content>
            </md-card>
            <div v-if="currentPrice">
              <md-card class="md-card-example">
                <md-card-header>
                  <div class="md-title">Scrap From Yahoo Finance</div>
                </md-card-header>
                <md-card-content>
                  <div  v-if="scrapLoader" class="loader">
                    <md-progress-spinner :md-diameter="40" :md-stroke="4" md-mode="indeterminate"></md-progress-spinner>
                  </div>
                </md-card-content>
                <md-card-content  v-if="scrap" >
                  <h3 class="md-subheading">Sector</h3>
                  <div class="card-reservation">
                    <div class="md-button-group">
                      <md-button>{{scrap.sector}}</md-button>
                    </div>
                  </div>
                </md-card-content>
                <md-card-content  v-if="scrap" >
                  <h3 class="md-subheading">Industry</h3>
                  <div class="card-reservation">
                    <div class="md-button-group">
                      <md-button>{{scrap.industry}}</md-button>
                    </div>
                  </div>
                </md-card-content>
                <md-card-content  v-if="scrap" >
                  <h3 class="md-subheading">Industry (from IEX api)</h3>
                  <div class="card-reservation">
                    <div class="md-button-group">
                      <md-button>{{scrap.responsedata.industry}}</md-button>
                    </div>
                  </div>
                </md-card-content>
              </md-card>
            </div>
          </div>
       </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'HomeComponent',
  data () {
    return {
      header: 'Sample Project On Node & Vue',
      info: null,
      search: '',
      company: '',
      news: '',
      quote: '',
      logo: '',
      selectedEmployee: null,
      symbols: [],
      loader: '',
      scrap: '',
      firstMonth: '',
      thirdMonth: '',
      currentPrice: '',
      firstPercentage: '',
      thirdPercentage: '',
      scrapLoader: ''
    }
  },
  methods: {
    processForm: function () {
      if (this.search) {
        this.loader = 1
        this.company = ''
        this.news = ''
        this.quote = ''
        this.logo = ''
        this.scrap = ''
        axios.get('https://api.iextrading.com/1.0/stock/' + this.search + '/company').then(response => (this.company = response.data))
        axios.get('https://api.iextrading.com/1.0/stock/' + this.search + '/logo').then(response => (this.logo = response.data))
        axios.get('https://api.iextrading.com/1.0/stock/' + this.search + '/quote').then(response => (this.quote = response.data))
        axios.get('https://api.iextrading.com/1.0/stock/' + this.search + '/news/last/3').then((response) => {
          this.news = response.data
        })
        axios.get('http://localhost:3000/api/scrapcontent?searchtext=' + this.search).then((response) => {
          this.scrap = response.data.data

          this.scrapLoader = ''
        })
        axios.get('https://api.iextrading.com/1.0/stock/' + this.search + '/chart/3m').then((response) => {
          if (response.data) {
            this.thirdMonth = response.data[0].close
            axios.get('https://api.iextrading.com/1.0/stock/' + this.search + '/chart/1m').then((response1) => {
              if (response1.data) {
                this.firstMonth = response1.data[0].close
                axios.get('https://api.iextrading.com/1.0/stock/' + this.search + '/price').then((response2) => {
                  if (response2.data) {
                    this.currentPrice = response2.data
                    let firstMonthCalc = (100 * this.firstMonth) / this.currentPrice
                    this.firstPercentage = 100 - firstMonthCalc
                    this.firstPercentage = this.firstPercentage.toFixed(2)
                    let thirdMonthCalc = (100 * this.thirdMonth) / this.currentPrice
                    this.thirdPercentage = 100 - thirdMonthCalc
                    this.thirdPercentage = this.thirdPercentage.toFixed(2)
                    this.loader = ''
                    this.scrapLoader = 1
                  }
                })
              }
            })
          }
        })
      }
    }
  },
  watch: {
    search: function (value) {
      if (value) {
        const CancelToken = axios.CancelToken
        const source = CancelToken.source()
        axios.get('http://localhost:3000/api/symbol?searchtext=' + value,
          {
            cancelToken: source.token
          }
        ).then((response) => {
          source.cancel()
          if (response.data) {
            this.symbols = response.data.data.company
          }
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.news-sec li {background: #eee; padding: 10px; margin: 5px 10px; border-radius: 5px; width: 98%; text-align: left;}
.news-sec li:nth-child(2n){background:#ddd;}
.news-sec li h5 {margin: 5px 0 0; color: #666; font-weight: normal;}
.clearfix::after{content:""; clear:both; display:block;}
.news-sec h3 {text-align: left; margin-left: 10px;}
.news-sec.clearfix {clear: both; border-top: 1px solid #ccc; margin: 0 0;}
.content {margin-top: 30px;}
.md-card {
    width: 320px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }
  .md-card-example {
    .md-subhead {
      .md-icon {
        $size: 16px;

        width: $size;
        min-width: $size;
        height: $size;
        font-size: $size !important;
      }
      span {
        vertical-align: middle;
      }
    }
    .card-reservation {
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .md-icon {
        margin: 8px;
      }
    }
    .md-button-group {
      display: flex;

      .md-button {
        min-width: 60px;
        border-radius: 2px;
      }
    }
  }
</style>
