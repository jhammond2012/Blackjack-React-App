import React from 'react';
import axios from 'axios';
import Card from './Parts/Card';
import './Fireworks.scss';

class Blackjack extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
    deckId: '',
    recipient: 0,
    playerHand: [],
    dealerHand: [],
    cardsDealt: 0,
    playerValue: 0,
    dealerValue: 0,
    playerStatus: '',
    dealerCardFlipped: false,
    cardsToDeal: 4,
    dealerFirstCard: 'https://cdn.shopify.com/s/files/1/0200/7616/products/playing-cards-bicycle-rider-back-2_grande.png',
    playerWin: false,
    dealerWin: false,
    totalCardsDealt: 0,
    playerBalance: 0
  }

  shuffleCards = () => {
    // Make a request for a user with a given ID
    axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6').then((res) => {
      // handle success      
      this.setState({
        deckId: res.data.deck_id
      });
    });
  }

  drawCard = (receiver) => {
    axios.get(`https://deckofcardsapi.com/api/deck/${this.state.deckId}/draw/?count=${this.state.cardsToDeal}`).then((res) => {
      const cards = res.data.cards;
      cards.map(card => {
        this.initiateDealerAutoDraw(card, receiver);
        
        if (this.state.cardsDealt === 1 || this.state.cardsDealt === 3) {
          this.initialPlayerDeal(card);
        }

        if (receiver === 'player') {
          if (this.state.cardsDealt > 3) {
            this.playerDrawCard(card);
          }
        }

        this.setState({
          cardsDealt: this.state.cardsDealt + 1,
          totalCardsDealt: this.state.totalCardsDealt + 1,
        });
      });
    });
  }

  playerDrawCard = (card) => {
    this.setState({
      playerHand: [...this.state.playerHand, card] 
    }, () => {
      this.setHandValue(card.value, 'playerValue');
    });
  }

  initialPlayerDeal = (card) => {
    this.setHandValue(card.value, 'playerValue');
    this.setState({
      playerHand: [...this.state.playerHand, card]
    }, () => {

      // Check for blackjack
      if(this.state.cardsDealt === 3) {
        this.checkForBlackjack();
      }
    });
  }

  initiateDealerAutoDraw = (card, receiver) => {
    if (this.state.cardsDealt === 0 || this.state.cardsDealt === 2 || (this.state.cardsDealt > 3 && receiver === 'dealer')) {
      this.setHandValue(card.value, 'dealerValue');
      this.setState({
        dealerHand: [...this.state.dealerHand, card],
        // dealerValue: this.state.dealerValue + parseInt(card.value)
      }, () => {
        if (this.state.playerValue <= 21 && this.state.dealerValue < 17) {
          this.dealerAutoDraw(this.state.dealerValue);
        } else {
          if(this.state.playerStatus === 'bust' || this.state.playerStatus === 'stand') {
            if (this.state.playerValue > this.state.dealerValue || this.state.dealerValue > 21) {
              this.determineWinner('player');
            } else {
              this.determineWinner('dealer');
            }
          }
        }
      });
    }
  }

  setHandValue = (cardValue, receiver) => {
    if(cardValue === 'KING' || cardValue === 'QUEEN' || cardValue === 'JACK') {
      this.setState({
        [receiver]: this.state[receiver] + 10
      }, () => {
        if (this.state.playerValue > 21) {
          this.determineWinner('dealer');
          this.flipDealerCard();
        }
      });
    } else if(cardValue === 'ACE') {
      this.setState({
        [receiver]: this.state[receiver] + 11
      }, () => {
        if (this.state.playerValue > 21) {
          this.flipDealerCard();
          this.determineWinner('dealer');
          this.setState({
            playerStatus: 'bust',
          })
        }
      });
    } else {
      this.setState({
        [receiver]: this.state[receiver] + parseInt(cardValue)
      }, () => {
        if (this.state.playerValue > 21) {
          this.flipDealerCard();
          this.determineWinner('dealer');
          this.setState({
            playerStatus: 'bust',
          })
        }
      });
    }
  }

  checkForBlackjack = () => {
    if(this.state.dealerValue === 21 && this.state.playerValue === 21) {
      this.determineWinner('nobody');
      this.flipDealerCard();
    } else if(this.state.dealerValue === 21 || this.state.playerValue === 21) {
      if(this.state.dealerValue === 21) {
        this.determineWinner('dealer');
        this.flipDealerCard();
      } else if (this.state.playerValue === 21) {
        this.determineWinner('player');
        this.flipDealerCard();
      }
    }
  }

  drawCardForHand = (receiver) => {
    this.setState({
      cardsToDeal: 1
    }, () => {
      if(receiver === 'player') {
        this.drawCard(receiver);
      }
    });
  }

  dealerAutoDraw = (dealerValue) => {
    if (this.state.cardsDealt > 3) {
      this.setState({
        cardsToDeal: 1
      }, () => {
        if(dealerValue < 17) {
          this.drawCard('dealer');
        } else {
          if(this.state.dealerValue > this.state.playerValue && dealerValue < 22 && (this.state.playerStatus === 'stand' || this.state.playerStatus === 'bust')) {
            this.determineWinner('dealer');
          } else if(this.state.dealerValue > 21) {
            this.determineWinner('player');
          }
        }
      });
    }   
  }

  playerStand = () => {
    this.setState({
      playerStatus: 'stand',
      receiver: 'dealer',
    });
    this.flipDealerCard()
    this.dealerAutoDraw(this.state.dealerValue);
  }

  renderDealerFirstCard = (index, image) => {
    // index === 0 ? 'https://cdn.shopify.com/s/files/1/0200/7616/products/playing-cards-bicycle-rider-back-2_grande.png' : image
    if (index === 0) {
      this.setState({
        dealerFirstCard: 'https://cdn.shopify.com/s/files/1/0200/7616/products/playing-cards-bicycle-rider-back-2_grande.png'
      });
    } else {
      this.setState({
        dealerFirstCard: image
      });
    }
  }

  flipDealerCard = () => {
    this.renderDealerFirstCard(this.state.cardsDealt, this.state.dealerHand[0].image);
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.playerValue !== this.state.playerValue) {
      // console.log('Prev Player Value', prevState.playerValue);
      // console.log('Current player Value', this.state.playerValue);
    }
  }

  determineWinner = (receiver) => {
    if(receiver === 'dealer') {
      this.setState({
        playerBalance: this.state.playerBalance - 1,
      });

      this.setState({
        dealerWin: true
      }, () => {
        setTimeout(() => {
          this.setState({
            dealerWin: false
          })
      }, 2000);      
      })
    } else if (receiver === 'player') {
      // this.playerWin();
      this.setState({
        playerBalance: this.state.playerBalance + 1,
      });

      this.setState({
        playerWin: true
      }, () => {
        setTimeout(() => {
          this.setState({
            playerWin: false
          })
      }, 2000);      
      })
    }
  }

  resetHand = () => {
    this.setState({
      recipient: 0,
      playerHand: [],
      dealerHand: [],
      playerValue: 0,
      dealerValue: 0,
      playerStatus: '',
      dealerCardFlipped: false,
      cardsToDeal: 4,
      dealerFirstCard: 'https://cdn.shopify.com/s/files/1/0200/7616/products/playing-cards-bicycle-rider-back-2_grande.png',
      playerWin: false,
      dealerWin: false,
      cardsDealt: 0,
    }, () => {
      this.drawCard()
    });
  }

  render() {
    const { dealerHand, playerHand, playerValue, cardsDealt, playerStatus, dealerFirstCard, playerWin, totalCardsDealt, playerBalance, dealerWin, dealerValue } = this.state;
    return (
      <>
        <div className="appTitle">
          <img src="https://p7.hiclipart.com/preview/946/856/840/euclidean-vector-money-icon-cash-bill.jpg" className="money-icon" alt="money money money" />
          <h1>Mike &amp; Jonathon's Blackjack</h1>
          <img src="https://p7.hiclipart.com/preview/946/856/840/euclidean-vector-money-icon-cash-bill.jpg" className="money-icon" alt="money money money" />
        </div>
        <div className="bj">
          <div className="gameInfo">
            <p>Player, you have {playerValue}!</p>
            <p>Your balance is: ${playerBalance}.00</p>
            {/* <Card card="3"/> */}
            <p>The Deck ID Is: {this.state.deckId}</p>
            <p>Cards Remaining: {312 - totalCardsDealt}</p>
            <div className="d-flex justify-content-between">
              <button className="btn btn-primary w-50 mr-2" onClick={this.shuffleCards}>Shuffle The Deck</button>
              <button className="btn btn-success w-50 ml-2" onClick={this.state.totalCardsDealt > 0 ? this.resetHand : this.drawCard}>{this.state.totalCardsDealt > 0 ? 'New Hand' : 'Initiate Shoe'}</button>
            </div>

            <hr />

            <div className="d-flex justify-content-between">
              <button className="btn btn-warning w-50 mr-2" onClick={() => this.drawCardForHand('player')} disabled={playerValue >= 21 || playerStatus === 'stand' || playerStatus === 'bust' || dealerValue >= 21 || playerWin === true || dealerWin === true}>Hit</button>
              <button className="btn btn-danger w-50 ml-2" onClick={() => this.playerStand()} disabled={playerStatus === 'stand' || playerStatus === 'bust' || playerValue >= 21 || dealerValue >= 21 || playerWin === true || dealerWin === true}>Stand</button>
              {/* <button onClick={this.flipDealerCard}>Flip</button> */}
            </div>
          </div>
          
          <div className="gameHolder">
            <div className="dealerHand">
              {dealerHand.length > 0 ? (
                dealerHand.map((item, index) => {
                  return (
                    <Card
                      key={index}
                      image={index === 0 ? dealerFirstCard : item.image}
                      alt={item.code}
                    />
                  )
                })
              ) : null}
            </div>

            <br />

            <div className="playerHand">
              {playerHand.length > 0 ? (
                playerHand.map((item, index) => {
                  return (
                    <Card
                      key={index}
                      image={item.image}
                      alt={item.code}
                    />
                  )
                })
              ) : null}
            </div>
          </div>
          {playerWin ? (
            <div className="pyro">
              <div className="before"></div>
              <div className="after"></div>
            </div>            
          ) : null}
        </div>
      </>
    )
  }
}

export default Blackjack;