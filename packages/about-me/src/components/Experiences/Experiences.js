import wave from "../../assets/img/wave.svg";
import './Experiences.css';

const Experiences = () =>
    <section className="experiences">
        <img src={wave} alt="division" className="wave" />
        <div className="experiences-body">
            <h2 className="experiences-title">Experience</h2>
            <div className="experiences-grid">
                <div className="experience experience_left">
                    <div className="experience-date">2021-23</div>
                    <div className="experience-company">Taxfix</div>
                    <div className="experience-position">Senior Software Engineer</div>
                    <div className="experience-description">
                    </div>
                </div>
                <div className="line"></div>
                <div className="empty"></div>
                <div className="empty"></div>
                <div className="line"></div>
                <div className="experience">
                    <div className="experience-date">2018-21</div>
                    <div className="experience-company">Plain Concepts</div>
                    <div className="experience-position">Frontend Technical Lead</div>
                    <div className="experience-description">
                        Developing complex projects with different architectures and state management strategies using React and Angular frameworks.
                        Applying best coding practices such as design patterns and different testing strategies (unit, integration or e2e).
                        Implementing many DevOps flows with CI/CD with Azure DevOps and GitHub actions.
                        Recruiting new employees.
                        Delivering a training to teammates.
                        Coordinating internal technical groups to optimize all the office projects and increase the technical level.
                    </div>
                </div>
                <div className="experience experience_left">
                    <div className="experience-date">2016-18</div>
                    <div className="experience-company">Grupo SM</div>
                    <div className="experience-position">Frontend Lead</div>
                    <div className="experience-description">
                        Stability and optimize a web application with a high volume of users.
                        Giving training and technical guidelines to more than 50 developers.
                        Unifying code and component among teams involved, improving their quality, and migrating them to an architecture with AMD (Asynchronous Module Definition) and Knockout.
                        Defining a testing strategy, using Jasmine and Sinon.
                        Developing services and tools to improve and automate internal processes with technologies such as Angular, Azure or Redis.
                    </div>
                </div>
                <div className="line"></div>
                <div className="empty"></div>
                <div className="empty"></div>
                <div className="line"></div>
                <div className="experience">
                    <div className="experience-date">2013-16</div>
                    <div className="experience-company">NETCheck</div>
                    <div className="experience-position">Senior Software Engineer</div>
                    <div className="experience-description">
                        Web application with HTML5, jQuery, Knockout, Kendo UI, ASP .NET MVC 5, Entity Framework 6, C#, SQL Server and a Domain Driven Design architecture.
                    </div>
                </div>

                <div className="experience experience_left">
                    <div className="experience-date">2011-13</div>
                    <div className="experience-company">Aventia Iberia</div>
                    <div className="experience-position">Senior Software Engineer</div>
                    <div className="experience-description">
                        Web and desktop applications with jQuery, ASP .NET MVC 3, Entity Framework 4, C#, SQL Server and a Domain Driven Design architecture.
                    </div>
                </div>
                <div className="line"></div>
                <div className="empty"></div>
                <div className="empty"></div>
                <div className="line"></div>
                <div className="experience">
                    <div className="experience-date">2009-11</div>
                    <div className="experience-company">Ahorro y Titulización S.G.F.T.</div>
                    <div className="experience-position">Junior Software Engineer</div>
                    <div className="experience-description">
                        Desktop applications with Visual Basic 6/.NET, Oracle and COM+.
                    </div>
                </div>
            </div>
        </div>
        <img src={wave} alt="division" className="wave wave_bottom" />
    </section>;

export { Experiences };
