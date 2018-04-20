import React from 'react';

export default class extends React.Component {
  render() {
    const data = this.props.data;

    if (data) {
      if (data.loading) {
        return (<div>Is Loading</div>)
      } else if (data.error) {
        return (<div>Error</div>)
      } else {
        return (
          <div>
            <h1> {data.markdownRemark.frontmatter.title}</h1>
            <div dangerouslySetInnerHTML={{__html: data.markdownRemark.html}}/>
          </div>
        )
      }
    } else {
      return null;
    }
  }
}
export const query = graphql`
  query BlogPostQuery($id: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: {eq: $id}) {
      html
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
