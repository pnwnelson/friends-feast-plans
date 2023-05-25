export default class Location {
  attendees = {};
  preteens = 0;
  teens = 0;
  youngAdults = 0;
  total = 0;
  constructor(props) {
    this.preteens = props.preteens;
    this.teens = props.teens;
    this.youngAdults = props.youngAdults;
    this.total = props.total;
  }
}
