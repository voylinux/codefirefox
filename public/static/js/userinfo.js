/**
 * @jsx React.DOM
 */

 "use strict";

define(['jquery', 'react', 'gravatar'], function($, React, GravatarIcon) {

  var UserInfoBox = React.createClass({
    getInitialState: function() {
      return { userInfo: {} };
    },
    handleSubmit: function(userInfo) {
      this.setState({userInfo: userInfo});

      clearTimeout(this.timeoutID);
      this.timeoutID = window.setTimeout(function() {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          type: 'POST',
          data: userInfo,
          success: function(userInfo) {
            this.setState({userInfo: userInfo});
          }.bind(this)
        });
      }.bind(this), 500);
    },
    loadFromServer: function() {
      $.getJSON(this.props.url, function(userInfo) {
        this.setState({userInfo: userInfo});
      }.bind(this));
    },
    componentWillMount: function() {
      this.loadFromServer();
    },
    render: function() {
      return (
        <div className='userInfoBox'>
          <h1>User Information</h1>
          <UserInfoForm 
            onUserInfoSubmit={this.handleSubmit}
            userInfo={this.state.userInfo}
          />
        </div>
      );
    } 
  });

  /**
   * Renders a form for the user information
   */
  var UserInfoForm = React.createClass({
    handleSubmit: function() {
      var displayName = this.refs.displayName.getDOMNode().value.trim();
      var website = this.refs.website.getDOMNode().value.trim();
      var bugzilla = this.refs.bugzilla.getDOMNode().value.trim();
      this.props.onUserInfoSubmit({ displayName: displayName, website: website, bugzilla: bugzilla });

      // Return false to cancel default page submit action
      return false;
    },
    getInitialState: function() {
      // TODO: hmmm this.props.userInfo doesn't exist yet...????
      // Instead I added a hack below in render
      return {displayName: this.props.userInfo.displayName, website: this.props.userInfo.website, bugzilla: this.props.userInfo.bugzilla };
    },
    handleDisplayNameChange: function(event) {
      this.setState({ displayName: event.target.value });
      this.handleSubmit();
    },
    handleWebsiteChange: function(event) {
      console.log('website');
      this.setState({ website: event.target.value });
      this.handleSubmit();
    },
    handleBugzillaChange: function(event) {
      console.log('bugzilla');
      this.setState({ bugzilla: event.target.value });
      this.handleSubmit();
    },
    render: function() {
      // Hack becuase getINitialState doesn't have this.props available
      if (!this.state.displayName)
        this.state.displayName = this.props.userInfo.displayName;
      if (!this.state.website)
        this.state.website = this.props.userInfo.website;
      if (!this.state.bugzilla)
        this.state.bugzilla = this.props.userInfo.bugzilla;

      return (
        <div id='profile-container'>
          <GravatarIcon emailHash={emailHash} size='200' url='http://gravatar.com'/>
          <div id='user-info-fields'>
          <form className='userInfoForm' onSubmit={this.handleSubmit}>
            <label htmlFor='email'>Email</label>
            <input type='text' placeholder='Email' ref='email' id='email' readOnly value={email} />
            <label htmlFor='displayName'>Display Name</label>
            <input type='text' placeholder='Display name shown for posting comments' ref='displayName' id='displayName' value={this.state.displayName } onChange={this.handleDisplayNameChange} />
            <label htmlFor='website'>Website</label>
            <input type='url' placeholder='Website linked when posting comments' ref='website' id='website' value={this.state.website } onChange={this.handleWebsiteChange} />
            <label htmlFor='bugzilla'>Bugzilla Email</label>
            <input type='text' placeholder='Bugzilla email' ref='bugzilla' id='bugzilla' value={this.state.bugzilla} onChange={this.handleBugzillaChange} />
          </form>
          </div>
          <div className='clear'/>
        </div>
      );
    }
  }); 
  React.renderComponent(
      <UserInfoBox url='/user/info.json' />,
    document.getElementById('user-info')
  );

 return UserInfoBox;
});
