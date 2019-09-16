import React from 'react';
import './Card.scss';

class Card extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {

  }
  render() {
    const { image, alt } = this.props;
    return (
      <div className="cardHolder">
        <div>
          <img src={image} alt={alt} />
        </div>
      </div>
    )
  }
}

export default Card;