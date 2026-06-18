import React from "react";
import { Col, Image, Row } from "react-bootstrap";
import "./styles.css";

const BlogAuthor = props => {
  const { name, firstName, lastName, avatar } = props;

  const displayName = name || `${firstName || ""} ${lastName || ""}`.trim() || "Utente Sconosciuto";

  return (
    <Row>
      <Col xs={"auto"} className="pe-0">
        <Image className="blog-author" src={avatar || "https://via.placeholder.com/40"} roundedCircle />
      </Col>
      <Col>
        <div>di</div>
        <h6>{displayName}</h6>
      </Col>
    </Row>
  );
};

export default BlogAuthor;
