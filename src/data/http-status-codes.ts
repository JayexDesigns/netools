export type HttpStatus = {
	code: number;
	reason: string;
	description: string;
};

export type HttpStatusClass = {
	id: string;
	range: string;
	title: string;
	description: string;
	codes: HttpStatus[];
};

// Every status code registered by IANA (RFC 9110 plus the WebDAV and related extensions), grouped by its first digit
export const httpStatusClasses: HttpStatusClass[] = [
	{
		id: "1xx",
		range: "1xx",
		title: "Informational",
		description: "The request was received and the conversation continues, there is no resource body yet.",
		codes: [
			{code: 100, reason: "Continue", description: "The server received the request headers and the client should resend them together with the body."},
			{code: 101, reason: "Switching Protocols", description: "The server agrees to switch to the protocol named in the request's Upgrade header, for example WebSocket."},
			{code: 102, reason: "Processing", description: "The server has accepted the request and is still working on it, so the client should wait for the final answer (WebDAV)."},
			{code: 103, reason: "Early Hints", description: "The server sends preliminary headers before the final response, letting the client start preloading the resources they mention."}
		]
	},
	{
		id: "2xx",
		range: "2xx",
		title: "Success",
		description: "The request was understood, accepted and handled successfully.",
		codes: [
			{code: 200, reason: "OK", description: "The request succeeded and the response carries the representation asked for, its meaning depends on the method used."},
			{code: 201, reason: "Created", description: "The request succeeded and a new resource was created, usually named in the Location header or in the response body."},
			{code: 202, reason: "Accepted", description: "The request was accepted for processing but has not been completed yet, it may still be rejected later."},
			{code: 203, reason: "Non-Authoritative Information", description: "The request succeeded but the returned metadata comes from a proxy or a cache instead of the origin server."},
			{code: 204, reason: "No Content", description: "The request succeeded and there is nothing to send back, the client keeps showing its current document."},
			{code: 205, reason: "Reset Content", description: "The request succeeded and the client should reset the form or document view it sent the request from."},
			{code: 206, reason: "Partial Content", description: "The server sends only the byte range named in the request's Range header, described by the Content-Range header."},
			{code: 207, reason: "Multi-Status", description: "The response carries a separate status for each operation of the request, listed in an XML or JSON body (WebDAV)."},
			{code: 208, reason: "Already Reported", description: "The members of a collection were already listed in an earlier response, so they are not repeated to avoid duplicates (WebDAV)."},
			{code: 226, reason: "IM Used", description: "The server fulfilled the request with the instance-manipulation method, for example delta encoding, applied to the resource."}
		]
	},
	{
		id: "3xx",
		range: "3xx",
		title: "Redirection",
		description: "The client must take further action, usually by following the URL given in the Location header.",
		codes: [
			{code: 300, reason: "Multiple Choices", description: "Several representations of the requested resource exist and the client, or the user, should pick one of them."},
			{code: 301, reason: "Moved Permanently", description: "The resource now lives at the URL in the Location header and search engines should update their index."},
			{code: 302, reason: "Found", description: "The resource is temporarily available at the URL in the Location header, the client keeps its original method."},
			{code: 303, reason: "See Other", description: "The client must fetch the result with a GET request to the URL given in the Location header."},
			{code: 304, reason: "Not Modified", description: "The resource has not changed since the conditional headers of the request, so the cached copy is reused and no body is sent."},
			{code: 305, reason: "Use Proxy", description: "The resource must be fetched through the proxy named in the Location header, deprecated and ignored by most clients."},
			{code: 306, reason: "Unused", description: "Reserved by an earlier version of the specification and never used, no response body is expected."},
			{code: 307, reason: "Temporary Redirect", description: "The resource temporarily lives at the URL in the Location header and the client must repeat the request with the same method."},
			{code: 308, reason: "Permanent Redirect", description: "The resource permanently lives at the URL in the Location header and the client must repeat the request with the same method."}
		]
	},
	{
		id: "4xx",
		range: "4xx",
		title: "Client Error",
		description: "The request is malformed or the client is not allowed to fulfil it, retrying it unchanged will fail again.",
		codes: [
			{code: 400, reason: "Bad Request", description: "The server cannot process the request because of malformed syntax, an invalid parameter or a corrupted body."},
			{code: 401, reason: "Unauthorized", description: "Authentication is required or failed, the client must send credentials of the kind named in the WWW-Authenticate header."},
			{code: 402, reason: "Payment Required", description: "Reserved for future use, a few APIs return it to mean that a payment or more credits are needed."},
			{code: 403, reason: "Forbidden", description: "The server understood the request but refuses to fulfil it, the client is known but lacks the permission to act."},
			{code: 404, reason: "Not Found", description: "The requested resource does not exist, or the server hides its existence on purpose."},
			{code: 405, reason: "Method Not Allowed", description: "The method is known but not supported by this resource, which lists the allowed ones in the Allow header."},
			{code: 406, reason: "Not Acceptable", description: "No representation of the resource matches the formats listed in the request's Accept headers."},
			{code: 407, reason: "Proxy Authentication Required", description: "The client must authenticate with the proxy first, as named in the Proxy-Authenticate header."},
			{code: 408, reason: "Request Timeout", description: "The server timed out while waiting for the client to send the request and may accept a retry later."},
			{code: 409, reason: "Conflict", description: "The request conflicts with the current state of the resource, for example editing an item that changed underneath."},
			{code: 410, reason: "Gone", description: "The resource is permanently gone, unlike 404 it will not come back and links to it should be removed."},
			{code: 411, reason: "Length Required", description: "The request is rejected because it relies on a Content-Length header that the client did not send."},
			{code: 412, reason: "Precondition Failed", description: "One of the conditions of the request, such as If-Match or If-None-Match, evaluated to false."},
			{code: 413, reason: "Content Too Large", description: "The request body is bigger than the server accepts, formerly called Payload Too Large."},
			{code: 414, reason: "URI Too Long", description: "The request URL is longer than the server is willing to interpret, formerly called Request-URI Too Long."},
			{code: 415, reason: "Unsupported Media Type", description: "The format of the request body is not supported here, the response names the formats the resource accepts."},
			{code: 416, reason: "Range Not Satisfiable", description: "The Range header asks for a part outside the bounds of the resource, formerly called Requested Range Not Satisfiable."},
			{code: 417, reason: "Expectation Failed", description: "The expectation named in the request's Expect header cannot be met by this server."},
			{code: 418, reason: "I'm a teapot", description: "A teapot refuses to brew coffee (from a 1998 April Fools' spec), some APIs answer it on purpose to reject a request in a memorable way."},
			{code: 421, reason: "Misdirected Request", description: "The request reached a server that cannot answer it, for example a connection reused for the wrong origin."},
			{code: 422, reason: "Unprocessable Content", description: "The body is syntactically correct but semantically wrong, for example a field that fails validation, formerly called Unprocessable Entity."},
			{code: 423, reason: "Locked", description: "The target resource is locked by another operation and cannot be modified until it is released (WebDAV)."},
			{code: 424, reason: "Failed Dependency", description: "An earlier operation this one depends on failed, so this one was aborted as well (WebDAV)."},
			{code: 425, reason: "Too Early", description: "The server refuses to process a request that might be replayed before it is safe to do so."},
			{code: 426, reason: "Upgrade Required", description: "The server refuses this protocol version and asks for one named in the Upgrade header, such as HTTP/2 or TLS."},
			{code: 428, reason: "Precondition Required", description: "The server requires conditional headers, to avoid overwriting a resource that changed after it was last read."},
			{code: 429, reason: "Too Many Requests", description: "The client sent more requests in a period of time than the server allows under its rate limiting policy."},
			{code: 431, reason: "Request Header Fields Too Large", description: "The request headers are bigger than the server accepts, they should be split up or stripped of cookies."},
			{code: 451, reason: "Unavailable For Legal Reasons", description: "The resource is blocked for legal reasons, such as a court order, and the response names them when it may."}
		]
	},
	{
		id: "5xx",
		range: "5xx",
		title: "Server Error",
		description: "The request looked valid but the server failed to fulfil it, the fault is on the server side.",
		codes: [
			{code: 500, reason: "Internal Server Error", description: "The server hit an unexpected condition that stopped it from handling the request."},
			{code: 501, reason: "Not Implemented", description: "The request method is unknown to the server and it will never support it, unlike with 405."},
			{code: 502, reason: "Bad Gateway", description: "A gateway or an upstream server returned an invalid or broken response to this one."},
			{code: 503, reason: "Service Unavailable", description: "The server is temporarily down for overload or maintenance, the Retry-After header may say when to come back."},
			{code: 504, reason: "Gateway Timeout", description: "The upstream server took too long to answer the gateway that forwarded the request."},
			{code: 505, reason: "HTTP Version Not Supported", description: "The server does not support the HTTP version named in the request line."},
			{code: 506, reason: "Variant Also Negotiates", description: "The content negotiation is broken, the chosen variant points back at itself."},
			{code: 507, reason: "Insufficient Storage", description: "The operation could not be carried out because the server lacks the storage space it needs (WebDAV)."},
			{code: 508, reason: "Loop Detected", description: "The server stopped the operation because it would have walked an endless chain of resources (WebDAV)."},
			{code: 510, reason: "Not Extended", description: "The request needs extensions that the client did not send, so the origin refuses to fulfil it."},
			{code: 511, reason: "Network Authentication Required", description: "The client must log into the network, for example a captive portal in an airport, before the request can be handled."}
		]
	}
];
