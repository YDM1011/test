module.exports = {
    apps : [
        {
            name: "TestApp",
            script: "./bin/www",
            watch: true,
            env: {
                "NODE_ENV": "production",
            }
        }
    ]
}