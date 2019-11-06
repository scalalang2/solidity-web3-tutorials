import React from 'react';

export default class App extends React.Component {
  state = {
    alert: {
      visible: true,
      message: '지갑이 연결되었습니다!'
    },
    wallet: {
      walletAddress: '0x1761b9c95026d1d3105E1eA632bCC5c0B23E7999',
      balance: 0,
      hasTicket: true,
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

  // '지갑 연동하기' 버튼 클릭시 실행 됨
  connect() {
    this.setState({
      wallet: {
        connected: true
      }
    })
    this.showAlert('지갑이 연결되었습니다.');
  }

  // '티켓 구매' 버튼 클릭시 실행 됨
  buyTicket() {

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
                { this.state.wallet.connected && (
                  <button type="button" className="btn btn-secondary" disabled={true}>지갑 연결 됨</button>
                ) }
                {
                  !this.state.wallet.connected && (
                    <button type="button" className="btn btn-primary" onClick={() => this.connect()}>지갑 연결 하기</button>
                  )
                }
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
                    <label class="col-sm-4">잔액 조회</label>
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

          {/* 티켓 구매하기  */}
          <div className="col-md-12 mt-4">
            <div className="card">
              <div className="card-header">
                티켓 구매하기
              </div>
              <div className="card-body">
                <button type="button" className="btn btn-primary" onClick={ () => this.check() }>티켓 구매하기</button>
              </div>
            </div>
          </div>

          {/* 당첨금 확인  */}
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