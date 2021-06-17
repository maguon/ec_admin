import React from 'react';

class Footer extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
    }

    render() {
        return (
            <footer>
                <div className="footer">
                    <span className="footer-msg">鸿溧科技</span>
                    <span className="footer-msg">司机之家管理系统1.0版</span>
                </div>
            </footer>
        )
    }
}

export default Footer;