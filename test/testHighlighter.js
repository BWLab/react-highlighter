var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var expect = require('chai').expect;
var Highlight = require('..');

global.document = require('jsdom').jsdom();
global.window = global.document.defaultView;

describe('Highlight element', function() {
  it('is what it says it is', function() {
    var element = React.createElement(Highlight, {search: 'world'}, 'Hello World');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'strong');

    expect(TestUtils.isElement(element)).to.be.true;
    expect(TestUtils.isElementOfType(element, Highlight)).to.be.true;
    expect(matches[0].getDOMNode().textContent).to.equal('World');
  });

  it('should have children', function() {
    var element = React.createElement(Highlight, {search: 'fox'}, 'The quick brown fox jumped over the lazy dog.');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithClass(node, 'highlight');

    expect(node.getDOMNode().children.length).to.equal(3);
    expect(matches).to.have.length(1);

  });

  it('should support custom HTML tag for matching elements', function() {
    var element = React.createElement(Highlight, {search: 'world', matchElement: 'em'}, 'Hello World');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'em');
    expect(matches).to.have.length(1);
  });

  it('should support custom className for matching element', function() {
    var element = React.createElement(Highlight, {search: 'Seek', matchClass: 'fffffound'}, 'Hide and Seek');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithClass(node, 'fffffound');
    expect(matches).to.have.length(1);
  });

  it('should support passing props to parent element', function() {
    var element = React.createElement(Highlight, {search: 'world', className: 'myHighlighter'}, 'Hello World');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'strong');

    expect(node.getDOMNode().className).to.equal('myHighlighter');
    expect(matches[0].getDOMNode().className).to.equal('highlight')
  });

  it('should support regular expressions in search', function() {
    var element = React.createElement(Highlight, {search: /[A-Za-z]+/}, 'Easy as 123, ABC...');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'strong');
    expect(matches[0].getDOMNode().textContent).to.equal('Easy');
    expect(matches[1].getDOMNode().textContent).to.equal('as');
    expect(matches[2].getDOMNode().textContent).to.equal('ABC');
  });

  it('should support escaping arbitrary string in search', function() {
    var element = React.createElement(Highlight, {search: 'Test ('}, 'Test (should not throw)');
    expect(TestUtils.renderIntoDocument.bind(TestUtils, element)).to.not.throw(Error);
  });
});
