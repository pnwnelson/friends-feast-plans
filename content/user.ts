export default class User {
  firstname = null;
  lastname = null;
  emailAddress = null;
  preteens = 0;
  teens = 0;
  youngAdults = 0;
  total = 0;

  constructor(props) {
    this.firstname = props.firistname;
    this.lastname = props.lastname;
    this.emailAddress = props.emailAddress;
    this.preteens = props.preteens;
    this.teens = props.teens;
    this.youngAdults = props.youngAdults;
    this.total = props.total;
  }
}
