import React from "react";
import Navigation from "../components/Navigation";
import {
  API_RESUME_JOBS,
  API_RESUME_SKILLS,
  API_RESUME_EDUCATION,
} from "../utils/Constants";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Job from "../types/job";
import Education from "../types/education";
import Skill from "../types/skill";
import clsx from "clsx";

const styles = makeStyles((theme: Theme) => ({
  main: {
    width: "80%",
    boxShadow: "0px 8px 16px 2px rgba(0,0,0,1)",
    height: 1000,
    margin: "auto",
    marginTop: 10,
    marginBottom: 100,
  },
  rowHeader: {
    fontFamily: "EB Garamond, cursive !important",
    marginTop: "25px !important",
    marginBottom: "0px !important",
  },
  row: {
    width: "90%",
    margin: "auto",
    display: "grid",
    alignItems: "center",
    justifyItems: "center",
  },
  threeColumnRow: {
    gridTemplateColumns: "1fr 1fr 1fr",
    height: 300,
  },
  fiveColumnRow: {
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
  },
  card: {
    height: "90%",
    width: "90%",
    cursor: "pointer",
    display: "grid",
    alignItems: "center",
    "&:hover": {
      height: "95%",
      width: "95%",
      boxShadow:
        "0px 2px 1px -1px rgb(200 200 200 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
    },
  },
  bigCard: {
    gridTemplateRows: "1fr 1fr",
  },
  smallCard: {
    gridTemplateRows: "3fr 1fr",
    textAlign: "center",
  },
  cardText: {
    fontFamily: "EB Garamond, serif !important",
    fontSize: "1rem !important",
  },
  cardImage: {
    maxWidth: "80%",
    maxHeight: "80%",
    margin: "auto",
  },
}));

const theme = {
  navBarBackgroundColor: "#ffffff",
  logoColor: "#000000",
  menuBackgroundColor: "#ffffff",
  cardBackgroundColor: "#ffffff",
  iconFillColor: "#000000",
};

interface ResumeProps {}

function Resume(props: ResumeProps) {
  const classes = styles();

  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);

  useEffect(() => {
    fetch(API_RESUME_JOBS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      resp
        .json()
        .then((json) => json.map((el) => el.Entity))
        .then((jobs) => {
          jobs = jobs.sort((a, b) => {
            if (a.ended.toLowerCase() === "current") return -1;
            return parseInt(a.ended) - parseInt(b.ended);
          });
          setJobs(jobs);
        });
    });

    //Retrieve Jobs
    fetch(API_RESUME_SKILLS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      resp
        .json()
        .then((json) => json.map((el) => el.Entity))
        .then((skills) => {
          setSkills(skills);
        });
    });

    //Retrieve Education
    fetch(API_RESUME_EDUCATION, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      resp
        .json()
        .then((json) => json.map((el) => el.Entity))
        .then((education) => {
          education = education.sort(
            (a, b) => parseInt(a.year) - parseInt(b.year)
          );
          setEducation(education);
        });
    });
  }, []);

  const makeJobCard = (job: Job) => {
    return (
      <Card className={clsx(classes.card, classes.bigCard)}>
        <CardMedia
          component="img"
          image={job.logo_url}
          classes={{
            media: classes.cardImage,
          }}
        />
        <CardContent>
          <Typography
            className={clsx(classes.cardText)}
            classes={{
              root: classes.cardText,
            }}
            variant="body1"
            color="text.primary"
          >
            {job.company}
          </Typography>
          <Typography
            className={clsx(classes.cardText)}
            variant="body1"
            color="text.primary"
          >
            {job.role}
          </Typography>
          <Typography
            className={clsx(classes.cardText)}
            variant="body1"
            color="text.primary"
          >
            {`${job.started} - ${job.ended}`}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const makeEducationCard = (education: Education) => {
    return (
      <Card className={clsx(classes.card, classes.bigCard)}>
        <CardMedia
          component="img"
          image={education.logo_url}
          classes={{
            media: classes.cardImage,
          }}
        />
        <CardContent>
          <Typography
            className={clsx(classes.cardText)}
            variant="body1"
            color="text.primary"
          >
            {education.school}
          </Typography>
          <Typography
            className={clsx(classes.cardText)}
            variant="body1"
            color="text.primary"
          >
            {education.level}
          </Typography>
          <Typography
            className={clsx(classes.cardText)}
            variant="body1"
            color="text.primary"
          >
            {`Major in ${education.major}`}
          </Typography>
          <Typography
            className={clsx(classes.cardText)}
            variant="body1"
            color="text.primary"
          >
            {`GPA: ${education.gpa}/4.0`}
          </Typography>
          <Typography
            className={clsx(classes.cardText)}
            variant="body1"
            color="text.primary"
          >
            {`Class of ${education.year}`}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const makeSkillCard = (skill: Skill) => {
    return (
      <Card className={clsx(classes.card, classes.smallCard)}>
        <CardMedia
          component="img"
          sx={{
            width: "unset",
          }}
          image={skill.logo_url}
          classes={{
            media: classes.cardImage,
          }}
        />
        <CardContent>
          <Typography
            className={clsx(classes.cardText)}
            variant="body1"
            color="text.primary"
          >
            {skill.name}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const jobCards = jobs.map((job: Job) => makeJobCard(job));
  const educationCards = education.map((education: Education) =>
    makeEducationCard(education)
  );
  const skillCards = skills.map((skill: Skill) => makeSkillCard(skill));

  return (
    <div>
      <Navigation theme={theme} />
      <Typography
        // className={clsx(classes.rowHeader)}
        variant="h2"
        color="text.primary"
        align="center"
        classes={{
          root: classes.rowHeader,
        }}
      >
        Experience
      </Typography>
      <div className={clsx(classes.row, classes.threeColumnRow)}>
        {jobCards}
      </div>
      <Typography
        className={clsx(classes.rowHeader)}
        variant="h2"
        color="text.primary"
        align="center"
      >
        Education
      </Typography>
      <div className={clsx(classes.row, classes.threeColumnRow)}>
        {educationCards}
      </div>
      <Typography
        className={clsx(classes.rowHeader)}
        variant="h2"
        color="text.primary"
        align="center"
      >
        Skills
      </Typography>
      <div className={clsx(classes.row, classes.fiveColumnRow)}>
        {skillCards}
      </div>
    </div>
  );
}

export default Resume;
