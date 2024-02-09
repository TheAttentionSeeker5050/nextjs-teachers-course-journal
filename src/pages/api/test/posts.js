import prisma from "@/data/prisma";


export default async function handle(req, res) {
    if (req.method === 'POST') {
        // const posts = await prisma.post.create({
        //     data: {
        //         title: req.body.title || '',
        //         content: req.body.content || '',
        //         published: req.body.published || false,
        //     },
        // })
        return res.status(200).json({})
    } else {
        return res.status(405).json({ message: 'Method not allowed' })
    }
    
}