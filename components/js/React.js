var React = require('react');
var ReactDOM = require('react-dom');

var loadJSON = function(callback) {   

	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', '/js/json/work.json', true); // Replace 'my_data' with the path to your file
	xobj.onreadystatechange = function () {
			if (xobj.readyState == 4 && xobj.status == "200") {
			// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			callback(xobj.responseText);
		}
	};
	xobj.send(null);  	
}

var ReturnImage = React.createClass({
	render: function() {
		var src = "images/" + this.props.image.src;
		return <img src={src} alt={this.props.image.alt} className="img-responsive"/>;
	}
})

var GenerateLink = React.createClass({
	render: function() {

		if (this.props.image.link) {
			return (<div className="work-image">
						<ReturnImage image={this.props.image} />
						<div className="work-image-hover">
  							<a href={this.props.image.link} target="_blank"><span className="sr-only">Go to</span>
  								{this.props.image.alt}    			
  							</a>
  						</div>
  					</div>);
		} else {
			return (<div className="work-image">
						<ReturnImage image={this.props.image} />
						<div className="work-image-hover">
							{this.props.image.alt}  
						</div>
					</div>);
			
		}
	}
});

// Distinguish between image and iframe
var WorkMedia = React.createClass({
	render: function() {
		if (this.props.item.embed) {
			return <iframe src={this.props.item.src} frameborder="0" className="img-responsive" />;
		} else {
			
			return <GenerateLink image={this.props.item} />;
		}
	}
});

// Create a single instace
var WorkRow = React.createClass({
	render: function() {
		return (<div className="col-sm-3 col-xs-6">
					<WorkMedia item={this.props.item} />
				</div>);
	}
})

// Build all work
var WorkItem = React.createClass({
	render: function() {
		var list = [];

		this.props.work.forEach(function(item, i) {
			var match;
			var filterText = this.props.filterText;

			for(var search in item) {
				var re = new RegExp(filterText.toLowerCase(), "g");
				match = String(item[search]).toLowerCase().match(re);
				if (match) {
					continue;
				}
			}

			if (match) {
				list.push(<WorkRow item={item} key={i}/>);
			}
		}.bind(this));

		return <div className="row">{list}</div>;
	}
})

var TechnicalKnowledge = React.createClass({
	render: function() {
		return <WorkItem work={this.props.work} filterText={this.props.filterText}/>;
	}
});

var SearchInput = React.createClass({
	handleChange: function() {
	    this.props.onUserInput(
	      	this.refs.filterTextInput.value
	    );
	},
	render: function() {
		return (<form>
				<div className="input-group">
					<label>
						<span className="sr-only">Search portfolio:</span>
						<input id="searcher" 
						type="text" 
						placeholder="Search portfolio/skills" 
						value={this.props.filterText}
						ref="filterTextInput"
						className="form-control"
						onChange={this.handleChange} />
					</label>
				</div>
			</form>
		);
	}
});

var Work = React.createClass({
	getInitialState: function() {
    	return {
      		filterText: ''
    	};
  	},
  	handleUserInput: function(filterText) {
    	this.setState({
      		filterText: filterText
    	});
  	},
	render: function() {
		return (<div className="work">
					<SearchInput filterText={this.state.filterText} onUserInput={this.handleUserInput} />
					<TechnicalKnowledge work={this.props.work} filterText={this.state.filterText} />
				</div>
		);
	}
});

loadJSON(function(response) {
	var WORK = JSON.parse(response);
	ReactDOM.render(<Work work={WORK}/>, document.getElementById('work'));
});