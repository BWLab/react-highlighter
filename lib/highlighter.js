var React = require('react');
var RegExpPropType = require('./regExpPropType');


var Highlighter = React.createClass({displayName: "Highlighter",
  count: 0,

  propTypes: {
    search: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.bool,
      RegExpPropType
    ]).isRequired,
    caseSensitive: React.PropTypes.bool,
    matchElement: React.PropTypes.string,
    matchClass: React.PropTypes.string,
    matchStyle: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      caseSensitive: false,
      matchElement: 'strong',
      matchClass: 'highlight',
      matchStyle: {}
    }
  },

  render: function() {
    return React.DOM.span(React.__spread({}, this.props), this.renderElement(this.props.children));
  },

  /**
   * A wrapper to the highlight method to determine when the highlighting
   * process should occur.
   *
   * @param  {string} subject
   *   The body of text that will be searched for highlighted words.
   *
   * @return {Array}
   *   An array of ReactElements
   */
  renderElement: function(subject) {
    if (this.isScalar() && this.hasSearch()) {
      var search = this.getSearch();
      return this.highlightChildren(subject, search);
    }

    return this.props.children;
  },

  /**
   * Determine if props are valid types for processing.
   *
   * @return {Boolean}
   */
  isScalar: function() {
    return (/string|number|boolean/).test(typeof this.props.children);
  },

  /**
   * Determine if required search prop is defined and valid.
   *
   * @return {Boolean}
   */
  hasSearch: function() {
    return (typeof this.props.search !== 'undefined') && this.props.search;
  },

  /**
   * Get the search prop, but always in the form of a regular expression. Use
   * this as a proxy to this.props.search for consistency.
   *
   * @return {RegExp}
   */
  getSearch: function() {
    if (this.props.search instanceof RegExp) {
      return this.props.search;
    }

    var flags = '';
    if (!this.props.caseSensitive) {
      flags +='i';
    }

    return new RegExp(this.props.search, flags);
  },

  /**
   * Get the indexes of the first and last characters of the matched string.
   *
   * @param  {string} subject
   *   The string to search against.
   *
   * @param  {RegExp} search
   *   The regex search query.
   *
   * @return {Object}
   *   An object consisting of "first" and "last" properties representing the
   *   indexes of the first and last characters of a matching string.
   */
  getMatchBoundaries: function(subject, search) {
    var matches = search.exec(subject);
    if (matches) {
      return {
        first: matches.index,
        last: matches.index + matches[0].length
      };
    }
  },

  /**
   * Determines which strings of text should be highlighted or not.
   *
   * @param  {string} subject
   *   The body of text that will be searched for highlighted words.
   *
   * @return {Array}
   *   An array of ReactElements
   */
  highlightChildren: function(subject, search) {
    var children = [];

    if (!search.test(subject)) {
      children.push(this.renderPlain(subject));
      return children;
    }

    var boundaries = this.getMatchBoundaries(subject, search);

    // Capture the string that leads up to a match...
    var nonMatch = subject.slice(0, boundaries.first);
    if (nonMatch) {
      children.push(this.renderPlain(nonMatch));
    }

    // Now, capture the matching string...
    var match = subject.slice(boundaries.first, boundaries.last);
    if (match) {
      children.push(this.renderHighlight(match));
    }

    // And if there's anything left over, recursively run this method again.
    var remaining = subject.slice(boundaries.last);
    if (remaining) {
      children = Array.prototype.concat(children, this.highlightChildren(remaining, search));
    }

    return children;
  },

  /**
   * Responsible for rending a non-highlighted element.
   *
   * @param  {string} string
   *   A string value to wrap an element around.
   *
   * @return {ReactElement}
   */
  renderPlain: function(string) {
    this.count++;
    return React.DOM.span({'key': this.count}, string);
  },

  /**
   * Responsible for rending a highlighted element.
   *
   * @param  {string} string
   *   A string value to wrap an element around.
   *
   * @return {ReactElement}
   */
  renderHighlight: function(string) {
    this.count++;
    return React.DOM[this.props.matchElement]({
      key: this.count,
      className: this.props.matchClass,
      style: this.props.matchStyle
    }, string);
  }
});

module.exports = Highlighter;
