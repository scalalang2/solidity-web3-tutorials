import React from 'react';

export default class App extends React.Component {
  state = {
    alert: {
      visible: true,
      message: '지갑이 연결되었습니다!'
    },
    wallet: {
      walletAddress: '',
      balance: 0,
      hasTicket: false,
      connected: false
    },
    info: {
      round: 0,
      winPrize: 0,
      totalSoldTickets: 0
    },
    soldTicketHistory: [],
    winnerHistory: []
  }

  contract_abi = null;
  contract_address = null;
  web3 = null;
  contract = null;

  // '지갑 연동하기' 버튼 클릭시 실행 됨
  async connect() {
    // Web3 패키지 로딩
    const Web3 = require('web3');

    // 주입된 web3가 존재한다면
    if(window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      // Metamask에 접근 요청
      await window.ethereum.enable();

      // 지갑 주소 가져오기
      var address = await this.web3.eth.getAccounts();
      address = address[0];

      // 현재 잔액 가져오기
      var balance = await this.web3.eth.getBalance(address);

      // 컨트랙트 정보 가져오기
      var result = await this.fetch_contract_info(address);

      // 화면 변경
      this.setState({
        wallet: {
          walletAddress: address,
          balance: balance,
          connected: true,
          hasTicket: result.hasTicket
        },
        info: {
          round: result.round,
          winPrize: result.winPrize,
          totalSoldTickets: result.totalSoldTickets
        }
      })

      this.showAlert('지갑이 연결되었습니다.');
    } else {
      this.showAlert('지갑이 연결에 실패하였습니다.');
    }
  }

  // 컨트랙트 정보 조회 
  async fetch_contract_info(address){
    this.contract_abi = require('./contract_abi.json');
    this.contract_address = '0x24410E953A9Fc7E7c194d4C92899bEE8B4C8Bef3';
    this.contract = new this.web3.eth.Contract(this.contract_abi, this.contract_address);

    var round = await this.contract.methods.round().call();
    var winPrize = await this.contract.methods.winPrize().call();
    var totalSoldTickets = await this.contract.methods.totalSoldTickets().call();
    var hasTicket = await this.contract.methods.hasTicket(address).call();

    return {
      round: round,
      winPrize: winPrize,
      totalSoldTickets: totalSoldTickets,
      hasTicket: hasTicket
    }
  }

  // '당첨금 확인' 버튼 클릭시 실행 됨
  check() {
    
  }

  // 상단 메시지 노출 함수
  showAlert(message) {
    this.setState({
      alert: {
        visible: true,
        message: message
      }
    });
  } 

  // 상단 메시지 가리기 함수
  dismissAlert() {
    this.setState({
      alert: {
        visible: false
      }
    })
  }

  render() {
    const TotalSoldTickets = () => {
      return this.state.soldTicketHistory.map((item) => {
        return (
          <tr>
            <td>{item.walletAddress}</td>
            <td>{item.timestamp}</td>
          </tr>
        )
      })
    }

    const WinnerHistory = () => {
      return this.state.winnerHistory.map((item) => {
        return (
          <tr>
            <td>{item.round}</td>
            <td>{item.sender}</td>
            <td>{item.winPrize}</td>
            <td>{item.timestamp}</td>
          </tr>
        )
      })
    }

    return (
      <div className="container">
        { this.state.alert.visible && (
          <div className="alert alert-info mt-4" role="alert">
            { this.state.alert.message }
            <button type="button" className="close" onClick={ () => this.dismissAlert() }>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}
        <div className="row">
          {/* 지갑 연결하기  */}
          <div className="col-md-12 mt-4">
            <div className="card">
              <div className="card-header">
                지갑 연동하기
              </div>
              <div className="card-body">
                <button type="button" className="btn btn-secondary" disabled={ this.state.wallet.connected } onClick={ () => this.connect() }>
                  지갑 연결 하기
                </button>
              </div>
            </div>
          </div>

          {/* 현재 정보 조회 하기 */}
          <div className="col-md-12 mt-4">
            <div className="card">
              <div className="card-header">
                복권 정보
              </div>
              <div className="card-body">
                <form>
                  <div class="form-group row">
                    <label class="col-sm-4">라운드</label>
                    <div class="col-sm-8">{ this.state.info.round }</div>
                  </div>
                  <div class="form-group row">
                    <label class="col-sm-4">당첨금</label>
                    <div class="col-sm-8">{ this.state.info.winPrize } Ether</div>
                  </div>
                  <div class="form-group row">
                    <label class="col-sm-4">총 판매된 티켓</label>
                    <div class="col-sm-8">{ this.state.info.totalSoldTickets } 티켓</div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* 현재 정보 조회 하기 */}
          <div className="col-md-12 mt-4">
            <div className="card">
              <div className="card-header">
                지갑 정보
              </div>
              <div className="card-body">
                <form>
                  <div class="form-group row">
                    <label class="col-sm-4">지갑주소</label>
                    <div class="col-sm-8">{ this.state.wallet.walletAddress }</div>
                  </div>
                  <div class="form-group row">
                    <label class="col-sm-4">현재 잔액</label>
                    <div class="col-sm-8">{ this.state.wallet.balance } Ether</div>
                  </div>
                  <div class="form-group row">
                    <label class="col-sm-4">티켓 보유 여부</label>
                    <div class="col-sm-8">{ this.state.wallet.hasTicket ? '티켓 보유 중' : '티켓 미보유 중' }</div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* 지갑 연결하기  */}
          <div className="col-md-12 mt-4">
            <div className="card">
              <div className="card-header">
                당첨금 확인
              </div>
              <div className="card-body">
                <button type="button" className="btn btn-primary" onClick={ () => this.check() }>당첨금 확인</button>
              </div>
            </div>
          </div>

          {/* 역대 판매 현황  */}
          <div className="col-md-12 mt-4">
            <div className="card">
              <div className="card-header">
                역대 판매 현황
              </div>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">지갑 주소</th>
                    <th scope="col">판매 시간</th>
                  </tr>
                </thead>
                <tbody>
                  <TotalSoldTickets />
                </tbody>
              </table>
            </div>
          </div>

          {/* 역대 당첨 현황  */}
          <div className="col-md-12 mt-4 mb-4">
            <div className="card">
              <div className="card-header">
                역대 당첨 현황
              </div>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col"># 라운드</th>
                    <th scope="col">당첨자 주소</th>
                    <th scope="col">상금</th>
                    <th scope="col">당첨시간</th>
                  </tr>
                </thead>
                <tbody>
                  <WinnerHistory />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}