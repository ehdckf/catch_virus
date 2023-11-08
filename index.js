const Fastify = require("fastify");
const multer = require("fastify-multer");
const NodeClam = require("clamscan");
const path = require("path");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const fastify = Fastify({ logger: true });
const PORT = 4000;

(async () => {
        /**
         * clamscan
         */

        const clamscanOptions = {
                removeInfected: true, // If true, removes infected files
                quarantineInfected: false, // False: Don't quarantine, Path: Moves files to this place.
                scanLog: null, // Path to a writeable log file to write scan results into
                debugMode: false, // Whether or not to log info/debug/error msgs to the console
                fileList: null, // path to file containing list of files to scan (for scanFiles method)
                scanRecursively: true, // If true, deep scan folders recursively
                clamscan: {
                        path: "/usr/bin/clamscan",
                        db: null,
                        scanArchives: true,
                        active: true,
                },

                preference: "clamdscan", // If clamdscan is found and active, it will be used by default
        };

        const ClamScan = await new NodeClam().init(clamscanOptions);

        /**
         * server
         */
        fastify.register(multer.contentParser);

        fastify.route({
                method: "POST",
                url: "/photos/upload",
                preHandler: upload.single("file"),
                handler: async (request, reply) => {
                        console.log(request.file);
                        const filePath = request.file.path;
                        const { file, isInfected, viruses } = await ClamScan.isInfected(
                                path.join(process.cwd(), filePath),
                        );
                        if (isInfected) {
                                fastify.log.fatal(`FAIL! x_x \n isInfected:${isInfected} \n viruses:${viruses}`);
                                reply.code(418).send(`FAIL! x_x \n isInfected:${isInfected} \n viruses:${viruses}`);
                        } else {
                                fastify.log.info(`SUCCESS! ^_^ \n isInfected:${isInfected} \n viruses:${viruses}`);
                                reply.code(200).send(`SUCCESS! ^_^ \n isInfected:${isInfected} \n viruses:${viruses}`);
                        }
                },
        });

        fastify.get("/", (request, reply) => {
                const indexHtmlBuffer = fs.readFileSync("index.html");
                reply.code(200).type("text/html").send(indexHtmlBuffer);
        });

        fastify.get("/ping", (request, reply) => {
                console.log("pingpong");
                reply.code(200).send("pong");
        });

        fastify.listen({ port: PORT, host: "0.0.0.0" }, (err, addr) => {
                if (err) {
                        fastify.log.fatal(err);
                        process.exit(1);
                }
                fastify.log.info(`Server is now Listning on ${addr}`);
        });
})();
