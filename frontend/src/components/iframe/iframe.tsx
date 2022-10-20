import React from 'react';

class Iframe extends React.Component<{ source: any }> {
    render() {
        let {source: source} = this.props;
        if (!source) {
            return <div>Loading...</div>;
        }
        return (
            <iframe
                style={{maxWidth:'100%', width:'100%', height:'100%', overflow:'visible'}}
                ref="iframe"
                src={source}
                width="100%"
                height={'100%'}
            />
        );
    }
}

export default Iframe;