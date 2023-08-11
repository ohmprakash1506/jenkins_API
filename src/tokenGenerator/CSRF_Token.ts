import axios from "axios";

async function CSRFToken(jenkinsUrl: any, username: any, password: any) {
  try {
    const crumbUrl = `${jenkinsUrl}crumbIssuer/api/json`;
    const response = await axios.get(crumbUrl, {
      auth: {
        username,
        password,
      },
    });

    const csrfCrumb = response.data.crumb;
    const csrfHeader = response.data.crumbRequestField
    console.log(`CSRFCRUMB:`, csrfCrumb);
    console.log(`CSRFHEADER`, csrfHeader);
    return { csrfCrumb, csrfHeader };
  } catch (error:any) {
    console.error(`Erorr generating token:`, error.message)
    throw error
  }
}

export default CSRFToken ;