function Help() {
    return <>
        <div className="container section">
            <div className="row">
                <div className="col-md-6">
                    <div className="jumbotron">
                        <h1 className="display-4">Any Questions?</h1>
                        <p className="lead">Send an email to the developer.</p>
                        <button type="button"  onClick={() => window.open('mailto:dilandevv@gmail.com', '_blank')} className="btn btn-success">
                            <span>&nbsp;</span>
                            <span>&nbsp;</span>✉️ Send Email<span>&nbsp;</span>
                            <span>&nbsp;</span>
                        </button>
                        <hr className="my-4"></hr>
                        <p>Got any suggestions or feedback? Help us improve.</p>
                        <a href="/feedback" className="btn btn-success">
                            <span>&nbsp;</span>
                            <span>&nbsp;</span>💡 Send Feedback<span>&nbsp;</span>
                            <span>&nbsp;</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Help;