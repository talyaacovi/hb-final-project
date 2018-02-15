"use strict";


class ListItemContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {listItems: [], searchItems: [], inputValue: '', editMode: false};
        // this.fetchListItems = this.fetchListItems.bind(this);
        this.fetchListItems();
        console.log(this.state);
    }

    // componentWillMount() {
    //     // if i want to get the username, listname, list_id before the page loads,
    //     // do i make a fetch request here? how do i fetch based on the requested URL?
    //     // example: http://localhost:5000/users/talyaac/react-lists/favorites
    //     this.fetchListItems();
    // }

    fetchListItems() {
        fetch('/list-items-react.json?lst_id=' + this.props.listId)
        .then((response) => response.json())
        .then((data) => this.setState({listItems: data.restaurants})
            );
    }

    addListItem(newRestaurant) {

        let payload = new FormData();
        payload.append('lst_id', this.props.listId);
        payload.append('yelp_id', newRestaurant);

        fetch('/add-restaurant-react.json', {
            method: 'POST',
            body: payload,
            credentials: 'same-origin'
        })
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                let currItems = this.state.listItems;
                currItems.push(data);
                this.setState({listItems: currItems});
            }
            else {
                alert('this restaurant already exists on this list!');
                }
            });
    }


    fetchSearchItems(evt) {
        evt.preventDefault();
        fetch(`/search-results-react.json?term=${this.state.inputValue}&username=${this.props.username}`)
        .then((response) => response.json())
        .then((data) => this.setState({searchItems: data.rests})
            );
    }

    updateInputValue() {
        // debugger;
        this.setState({inputValue: evt.target.value});
    }

    toggleEditMode(evt) {
        console.log('toggle button');
        this.setState(prevState => ({editMode: !prevState.editMode}));
    }

    removeItem() {
        console.log('remove button');
    }

    render() {
        let listItems = [];
        console.log('end logging, ', this.state.listItems);
        // for (let item of this.state.listItems) {
        for (let i = 0; i < this.state.listItems.length; i++) {

            let item = this.state.listItems[i];

            listItems.push(<ListItem yelpid={item.yelp_id} itemid={item.item_id}
                rest={item.rest_name} category={item.yelp_category}
                url={item.yelp_url} image={item.image} key={item.item_id}/>);

            if (this.state.editMode) {
                listItems.push(<button className='del-btn' onClick={this.removeItem.bind(this)} key={i}>Remove Restaurant</button>);
            }
        }

        let searchItems = [];

        for (let item of this.state.searchItems) {
            searchItems.push(<SearchItem yelpid={item.id} addRestaurantHandler={this.addListItem.bind(this)}
                rest={item.name} address={item.location} key={item.id}/>);
        }

        let buttonText;
        let listControls;

        if (this.state.editMode) {
            buttonText = 'Save List';
        }

        else {
            buttonText = 'Edit List';
        }

        if (viewingOwnPage) {
            listControls =
                    <div>
                        <div id='edit-list'>
                            <button onClick={this.toggleEditMode.bind(this)}>{ buttonText }</button>
                        </div>
                        <div id='search-restaurants'>
                            <h2>Search for a restaurant you love in San Francisco!</h2>
                            <form onSubmit={this.fetchSearchItems.bind(this)}>
                                <input value={this.state.inputValue} onChange={this.updateInputValue.bind(this)}></input>
                                <button>Search</button>
                            </form>
                        </div>
                    </div>
        }

// how do i only display this button if the list owner is the one logged in?
        return (<div>
                    {listControls}
                    <div id='results-div'>
                        {searchItems}
                    </div>
                    <div id='list-items'>
                        {listItems}
                    </div>
                </div>);
    }
}

class ListItem extends React.Component {
    render() {
        return (<div data-yelp-id={ this.props.yelpid } data-item-id={ this.props.itemid }>
                    <h3>{ this.props.rest }</h3>
                    <p>{ this.props.category }</p>
                    <a href={ this.props.url }>Yelp</a>
                    <div className='yelp-img'>
                        <img src={ this.props.image }/>
                    </div>
                </div>
            );
    }
}

class SearchItem extends React.Component {
    buttonClickHandler() {
        this.props.addRestaurantHandler(this.props.yelpid);
    }
    render() {
        return (<div data-yelp-id={ this.props.yelpid }>
                    <p>{ this.props.rest }</p>
                    <p>{ this.props.address }</p>
                    <button onClick={this.buttonClickHandler.bind(this)} data-yelp-id={ this.props.yelpid } className='add-btn'>Add Restaurant</button>
                </div>
            );
    }

}