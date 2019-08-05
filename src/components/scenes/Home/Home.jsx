import React, { Component } from 'react';
import { Link } from 'gatsby';
import { withFirebase } from '../../../utils/Firebase';

export class Home extends Component {
  _initFirebase = false;

  state = {
    posts: [],
    loading: true,
    title: '',
    description: '',
  };

  firebaseInit = () => {
    if (this.props.firebase && !this._initFirebase) {
      this._initFirebase = true;

      this.getPosts();
    }
  };

  getPosts = () => {
    const { firebase } = this.props;

    firebase
      .posts()
      .get()
      .then(querySnapshot => {
        console.log(querySnapshot.docs);
        const data = querySnapshot.docs.map(item => item.data());
        this.setState({
          posts: data,
          loading: false,
        });
      });
  };

  componentDidMount() {
    this.firebaseInit();
  }

  componentDidUpdate() {
    this.firebaseInit();
  }

  handleSubmit = e => {
    e.preventDefault();
    const { title, description } = this.state;
    const { firebase } = this.props;

    console.log('asdasd');

    firebase.posts().add({
      title,
      description,
    });
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { posts, description, title, loading } = this.state;

    if (loading) return null;

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              name="title"
              type="text"
              onChange={this.handleChange}
              value={title}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              cols="30"
              rows="10"
              onChange={this.handleChange}
              value={description}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        {posts.map((item, id) => (
          <div>
            <Link to={'/post/' + item.title} key={id}>
              {item.title}
            </Link>
            <div key={id}>{item.description}</div>
          </div>
        ))}
      </div>
    );
  }
}

export default withFirebase(Home);
