import { Inter } from "next/font/google";



const inter = Inter({ subsets: ["latin"] });

export const config = {
  runtime: "nodejs" // 'nodejs', // or "edge"
}

// run getServerSideProps to get the user from req.user
export const getServerSideProps = async ({ req, res }) => {
  
  // parse the json content from req.headers['x-user-payload']
  const user = JSON.parse(req.headers['x-user-payload']);
  
  
  return { props: { user: user } }
}

export default function Home(props) {



    return (
      <main
        className={`${inter.className}`}
      >
        <h1 className="">
          Profile Page
        </h1>

        <p>Email: {props.user?.email}</p>
  
        
      </main>
    );
  }
  