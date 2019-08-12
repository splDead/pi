import React from 'react';
import axios from 'axios';
import LoadingForm from './LoadingForm';
import TablePrice from './TablePrice';

class Dashboard extends React.Component {

    state = {
        prices: [],
        ids: ''
    };

    handleSearch = () => {
        const { ids } = this.state;

        if (!ids) {
            return;
        }

        axios.post(`https://api.evemarketer.com/ec/marketstat/json?typeid=${ids.map(el => el.value)}`)
            .then(response => {
                this.setState({
                    prices: response.data
                })
            })
    };

    handleChangeId = ids => {
        this.setState({ ids });
    };

    render() {

        const {
            prices,
            ids
        } = this.state;

        return (
            <div>
                <h1>Planetary Interaction</h1>
                <LoadingForm onLoad={this.handleSearch} id={ids} onChange={this.handleChangeId}/>
                <TablePrice prices={prices} />
            </div>
        )
    }
}

export default Dashboard;
