module.exports = {
        apps: [
                {
                        name: "file_upload",
                        script: "node index.js",
                        error_file: "./logs/file_upload_err",
                        out_file: "./logs/file_upload_out",
                        combine_logs: true,
                        log_date_format: "YYYY-MM-DD_HH-mm-ss",
                },
        ],
};
