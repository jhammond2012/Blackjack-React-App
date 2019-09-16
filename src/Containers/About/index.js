import React from 'react';
import axios from 'axios';

class About extends React.Component {
  state = {
    posts: []
  }

  componentDidMount = () => {
    this.getPosts();
  }

  getPosts = () => {
    axios.get('https://ncdoj.gov/wp-json/').then((res) => { console.log('Full', res)});
    axios.get('https://ncdoj.gov/wp-json/wp/v2/posts').then((res) => {
      console.log('The Result:', res)
      this.setState({
        posts: res.data
      });
    });
  }

  render() {
    const { posts } = this.state;
    return (
      <div>
        <h1>About (AKA: Posts)</h1>
        <div className="thePosts">
          <ul>
            {posts.map((post, index) => {
              return (
                <li>
                  {post.title.rendered}<br/>
                  {post.excerpt.rendered}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}

export default About;