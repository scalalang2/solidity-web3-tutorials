pragma solidity ^0.5.6;

// Lottery
contract Lottery {
    mapping (address => bool) public hasTicket;
    uint256 public round;               // 복권 라운드
    uint256 public winPrize;            // 현재 당첨금
    uint256 public totalSoldTickets;    // 총 판매된 티켓

    event PaidTicket(address sender, uint256 timestamp);
    event Winner(address sender, uint256 prize, uint256 round, uint256 timestamp);

    constructor() public{
        winPrize = 0;
        round = 0;
    }

    // 복권 구입하기
    // 1. 복권 구입 가격은 0.01 ether이다.
    // 2. 복권 구입 내역을 기록한다.
    function buyTicket() public payable {
        require(!hasTicket[msg.sender], "You already have a ticket.");
        require(msg.value == 0.01 ether, "ticket price must be 0.01 ether");

        hasTicket[msg.sender] = true;
        winPrize += msg.value;
        totalSoldTickets += 1;

        emit PaidTicket(msg.sender, block.timestamp);
    }

    // 당첨 확인하기
    // 1. 블록 해시값과 seed를 이용하여 랜덤값을 추출한다.
    // 2. Modulo 10 연산을 하여 결과값이 7 이면 당첨금을 지급한다.
    function check(uint8 seed) public payable returns (uint256, bool) {
        require(hasTicket[msg.sender], "You do not have a ticket");
        hasTicket[msg.sender] = false;
        
        uint256 result = _random(seed);

        if(result == 7) {
            msg.sender.transfer(winPrize);
            emit Winner(msg.sender, winPrize, round, block.timestamp);

            round += 1;
            winPrize = 0;
            return (result, true);
        } else {
            return (result, false);
        }
    }

    // 랜덤 함수 : 컨트랙트 내부에서만 사용한다.
    function _random(uint8 seed) public view returns (uint256) {
        uint256 _seed = uint256(blockhash(block.number-1)) + seed;
        uint256 _random_number = uint256(keccak256(abi.encodePacked(_seed)));
        return _random_number % 10;
    }
}