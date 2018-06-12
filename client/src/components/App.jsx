import React from 'react';
import $ from 'jquery';
import Listing from './Listing.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      slide: 0,
      visibilityLeft: 'hidden',
      visibilityRight: 'visible',
      lists: [{ id: 1, name: '' }],
      lists2listings: [{listId: 0, listingId: 0}],
    };
  }

  componentDidMount() {
    this.getListings();
    this.checkCarousel();
    this.getLists();
  }

  getListings() {
    $.ajax({
      method: 'GET',
      url: '/listing',
      success: (res) => {
        this.setState({
          data: JSON.parse(res),
        }, this.getLists2Listings);
      },
    });
  }

  getLists() {
    $.ajax({
      method: 'GET',
      url: '/lists',
      success: (res) => {
        console.log(JSON.parse(res));
        this.setState({
          lists: JSON.parse(res),
        });
      },
    });
  }

  getLists2Listings() {
    const listingIds = this.state.data.map((listing) => listing.id);
    console.log(listingIds);

    $.ajax({
      method: 'GET',
      url: '/lists2listings',
      data: {
        listingIds: listingIds,
      },
      success: (res) => {
        this.setState({
          lists2listings: JSON.parse(res)
        });
      },
    });
  }

  slideRight() {
    $('#slides').animate({ 'margin-left': '-=350px' }, 300);
    this.setState({
      slide: this.state.slide + 1,
    }, this.checkCarousel);
  }

  slideLeft() {
    $('#slides').animate({ 'margin-left': '+=350px' }, 300);
    this.setState({
      slide: this.state.slide - 1,
    }, this.checkCarousel);
  }

  checkCarousel() {
    this.state.slide < 1 ? this.toggleShow('Left', 'hidden') : this.toggleShow('Left', 'visible');
    this.state.slide < 9 ? this.toggleShow('Right', 'visible') : this.toggleShow('Right', 'hidden');
  }

  toggleShow(dir, visibility) {
    this.setState({
      [`visibility${dir}`]: visibility,
    });
  }

  toggleLike(id) {
    $.ajax({
      method: 'POST',
      url: '/like',
      data: { data: id },
      success: () => console.log('toggled like'),
      err: () => console.log('there was an error'),
    });
  }

  render() {
    return (
      <div id="wrapper">
        <img src="leftArrow.png" alt="" id="left" onClick={this.slideLeft.bind(this)} className={this.state.visibilityLeft}/>
        <div id="container">
          <h1> Similar listings </h1>
          <div id="slides">
            {this.state.data.map(listing => (<Listing
              listing={listing}
              toggleLike={this.toggleLike.bind(this)}
              lists={this.state.lists}
              lists2listings={this.state.lists2listings}
            />))}
          </div>
        </div>
        <img src="rightArrow.png" alt="" id="right" onClick={this.slideRight.bind(this)} className={this.state.visibilityRight}/>
      </div>
    );
  }
}

export default App;
