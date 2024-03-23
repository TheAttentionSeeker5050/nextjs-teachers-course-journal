export default function (req, res) {
    // if different than post, return 405 method not allowed
    if (req.method !== 'POST') {
        return res.status(405).end()
    }
    
    res.status(200).json({ name: 'Example' })
}