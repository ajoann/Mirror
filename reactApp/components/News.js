import React from 'react';
import axios from 'axios';

const NEWS_API_KEY = 'f6c882d2ff2c4c949ffc69ba6d5c0dac';

class News extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      allSources: [],
      allArticles: [],
      currentSource: {},
      currentArticles: [],
      image: '',
      socket: props.socket
    };

    this.selectSource = this.selectSource.bind(this);
    console.log('news rendered');
  }

  componentDidMount () {
    const self = this;

    //api call
    axios.get('https://newsapi.org/v1/sources?language=en')
    .then(resp => {
      const newSources = [...resp.data.sources];
      this.setState({allSources: newSources});
    })
    .catch(console.log);

    // called only once
    self.state.socket.on('connect', () => {
      console.log('CLIENT news connected to sockets');
      self.state.socket.emit('join', 'NEWS');
    });

    // listen for end of stt
    self.state.socket.on('stt_finished', respObj => {
      console.log('received stt finished', respObj);
      self.processRequest(respObj);
    });

  }

  processRequest(respObj) {
    const self = this;

    if (respObj.category === 'news' && respObj.params && respObj.params.newsSource) {
      // change state of news here from respObj params
      self.selectSource(respObj.params.newsSource)
      .then(() => {
        console.log('going to start listening again');
      })
      .catch( err => {
        console.log('ERROR :(', err);
      });

    } else if (respObj.category === 'news' && respObj.params && respObj.params.newsAction) {
      self.nextArticles();
    } else if (respObj.category === 'news article') {
      console.log('in news article with article: ', respObj.params.number, respObj.params.ordinal);
      // user specifies number of article
      const articleNum = parseInt(respObj.params.number) || parseInt(respObj.params.ordinal) || 1;
      // send wContainer back message
      self.state.socket.emit('custom_msg', { resp: "Great! Article link sent to your phone" })
      // twilio texts article to user
      self.pinArticle(articleNum - 1);

    } else {
      // self.state.socket.emit('invalid_request');
    }
  }

  // function for user to select specific news source
  // sets state with source and headlines, returns null if not found
  selectSource (sourceName) {
    const self = this;
    return new Promise( (resolve, reject) => {

      this.state.allSources.map(source => {
        if (source.name.toLowerCase().startsWith(sourceName.toLowerCase())) {
          console.log('current source', this.state.currentSource);
          this.setState({currentSource: source});
        }
      });

      axios.get(`https://newsapi.org/v1/articles?source=${this.state.currentSource.id}&apiKey=${NEWS_API_KEY}`)
      .then( resp => {
        console.log('in set current articles')
        self.setState({allArticles: [...resp.data.articles], currentArticles: resp.data.articles.slice(0,5)});
        //   self.setState({image: resp.data.articles[0].urlToImage});
        resolve('success');
      })
      .catch( err => {
        reject('errrorrrrr', err);
      });
    });
  }

  nextArticles () {
    // set next starting position within all articles array
    const nextPos = this.state.allArticles.indexOf(this.state.currentArticles[this.state.currentArticles.length]) + 1;
    this.setState({currentArticles: this.state.currentArticles.slice(nextPos, nextPos+4)})
  }

  // function that texts user with link to article of their choosing
  pinArticle (articleNum) {
    console.log('CLIENT in send article', articleNum, this.state.currentArticles);

    if (articleNum < this.state.currentArticles.length) {
      this.setState({currentSource: this.state.currentArticles[articleNum]});

      const linkToSend = this.state.currentSource.url;
      console.log('LINK', linkToSend);
      axios.post('/sendArticle', {link: linkToSend});

    } else {
      console.log('this is here in the else of pin article');
    }
  }

  render () {
    const newsStyle = {
      width: '100%',
    };
    return (
      <div className="newsContainer right widget" style={newsStyle} style={{color: 'white'}}>

        {(this.state.currentArticles.length===0) && <div className="newsList newsAnimation" style={{color: 'white'}}>
          {this.state.allSources.map((source, i) => {
            return (<div className="newsListItem" key={i}>{source.name}</div>);
          })}
        </div> }

        {!(this.state.currentArticles.length===0) && <div className="newsList newsArticles" style={{color: 'white'}}>
          {this.state.currentArticles.map((article, i) => {
            return (<div className="newsListItem" key={i}>{article.title}</div>);
          })}
        </div> }
      </div>
    );
  }
}

export default News;
