const UUID = require ('uuid')
const {SmevSoap} = require ('../')
const s = new SmevSoap ()

const id = UUID.v4 ()

const xml = `<?xml version="1.0"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
  <SOAP-ENV:Header/>
  <SOAP-ENV:Body>
    <ns2:GetResponseResponse xmlns:ns2="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/1.1" xmlns:ns3="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/basic/1.1" xmlns:ns4="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/faults/1.1">
      <ns2:ResponseMessage>
        <ns2:Response Id="SIGNED_BY_SMEV">
          <ns2:OriginalMessageId>cfbd94c8-7d53-11ed-9ce8-3388bad5aac4</ns2:OriginalMessageId>
          <ns2:SenderProvidedResponseData Id="response-data-60fdd9f3-ba3d-4cbe-ad5c-0a05a460c36c">
            <ns2:MessageID>${id}</ns2:MessageID>
            <ns2:To>eyJzaWQiOjM0MzIyLCJtaWQiOiJjZmJkOTRjOC03ZDUzLTExZWQtOWNlOC0zMzg4YmFkNWFhYzQiLCJlb2wiOjAsInJ0dGwiOjAsInJlb2wiOjAsInJ0aSI6ZmFsc2UsInNsYyI6InVybjpkb20uZ29zdXNsdWdpLnJ1X2FjY3J1YWxzLXBheW1lbnRzLWVnaXNzb18xLjAuMl9FeHBvcnRBY2NydWFsc1BheW1lbnRzUmVxdWVzdCIsIm1ubSI6Ijc4MDAwMiIsImNydCI6IjIwMjItMTItMTZUMTg6MTA6MjcuMDQ1KzAzOjAwIiwiY2lkIjoiY2ZiZDk0YzgtN2Q1My0xMWVkLTljZTgtMzM4OGJhZDVhYWM0IiwibnMiOiJ1cm46ZG9tLmdvc3VzbHVnaS5ydS9hY2NydWFscy1wYXltZW50cy1lZ2lzc28vMS4wLjIiLCJvcmlkIjpudWxsfQ==</ns2:To>
            <ns3:MessagePrimaryContent>
              <tns:ExportAccrualsPaymentsResponse xmlns:tns="urn:dom.gosuslugi.ru/accruals-payments-egisso/1.0.2" xmlns="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/basic/1.1" xmlns:env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mime="urn:dom.gosuslugi.ru:mime-headers" xmlns:ns10="http://www.w3.org/2004/08/xop/include" xmlns:ns3="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/faults/1.1" xmlns:ns5="http://www.w3.org/2000/09/xmldsig#" xmlns:ns6="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/basic/1.1" xmlns:ns7="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/faults/1.1" xmlns:ns8="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/1.1" xmlns:ns9="urn:dom.gosuslugi.ru/common/1.2.0">
                <tns:exported-to-ftp>true</tns:exported-to-ftp>
                <tns:create-date>2022-12-16T18:10:29.919+03:00</tns:create-date>
                <tns:error>
                  <ns9:error-code>HFO-009</ns9:error-code>
                  <ns9:description>Для комнаты в многоквартирном доме с идентификатором 9c673d43-fce9-447c-9ba5-f306d2d522c3 не найдено ни одного лицевого счета</ns9:description>
                </tns:error>
                <tns:error>
                  <ns9:error-code>HFO-009</ns9:error-code>
                  <ns9:description>Для комнаты в многоквартирном доме с идентификатором 4149e45d-1e8f-454a-9713-887842617dcb не найдено ни одного лицевого счета</ns9:description>
                </tns:error>
              </tns:ExportAccrualsPaymentsResponse>
            </ns3:MessagePrimaryContent>
            <ns3:RefAttachmentHeaderList>
              <ns3:RefAttachmentHeader>
                <ns3:uuid>d25f943c-7d53-11ed-b719-005056b6dfa8</ns3:uuid>
                <ns3:Hash>1rtlg0d/wsSfCWdxQprxj41R+0t0gjvZ8nF1GEX+Veo=</ns3:Hash>
                <ns3:MimeType>application/zip</ns3:MimeType>
                <ns3:SignaturePKCS7>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</ns3:SignaturePKCS7>
              </ns3:RefAttachmentHeader>
            </ns3:RefAttachmentHeaderList>
          </ns2:SenderProvidedResponseData>
          <ns2:MessageMetadata>
            <ns2:MessageId>d2e08410-7d53-11ed-b719-005056b6dfa8</ns2:MessageId>
            <ns2:MessageType>RESPONSE</ns2:MessageType>
            <ns2:Sender>
              <ns2:Mnemonic>MNSV14_3S</ns2:Mnemonic>
              <ns2:HumanReadableName>ГИС ЖКХ-2</ns2:HumanReadableName>
            </ns2:Sender>
            <ns2:SendingTimestamp>2022-12-16T18:10:49.241+03:00</ns2:SendingTimestamp>
            <ns2:DestinationName>unknown</ns2:DestinationName>
            <ns2:Recipient>
              <ns2:Mnemonic>780002</ns2:Mnemonic>
              <ns2:HumanReadableName>СМЭВ СПБ - Агрегатор</ns2:HumanReadableName>
            </ns2:Recipient>
            <ns2:SupplementaryData>
              <ns2:DetectedContentTypeName>not detected</ns2:DetectedContentTypeName>
              <ns2:InteractionType>NotDetected</ns2:InteractionType>
            </ns2:SupplementaryData>
            <ns2:DeliveryTimestamp>2022-12-16T18:10:59.144+03:00</ns2:DeliveryTimestamp>
            <ns2:Status>responseIsDelivered</ns2:Status>
          </ns2:MessageMetadata>
          <ns3:FSAttachmentsList>
            <ns3:FSAttachment>
              <ns3:uuid>d25f943c-7d53-11ed-b719-005056b6dfa8</ns3:uuid>
              <ns3:UserName>miQwZSKLtGfqHkLMPH9ILzQFBfzwf3</ns3:UserName>
              <ns3:Password>g8x9BjllxzxypZ6kL7UBdlnd2CbQ9P</ns3:Password>
              <ns3:FileName>/d25f943c-7d53-11ed-b719-005056b6dfa8.zip</ns3:FileName>
            </ns3:FSAttachment>
          </ns3:FSAttachmentsList>
        </ns2:Response>
        <ns2:SMEVSignature>
          <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/basic/1.1" xmlns:ns3="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/faults/1.1">
            <ds:SignedInfo>
              <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
              <ds:SignatureMethod Algorithm="urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102012-gostr34112012-256"/>
              <ds:Reference URI="#SIGNED_BY_SMEV">
                <ds:Transforms>
                  <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
                  <ds:Transform Algorithm="urn://smev-gov-ru/xmldsig/transform"/>
                </ds:Transforms>
                <ds:DigestMethod Algorithm="urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34112012-256"/>
                <ds:DigestValue>hAv0N6sjpj1lOsDu/8zZLAdUgA228RNqXJ/z5eUkEdo=</ds:DigestValue>
              </ds:Reference>
            </ds:SignedInfo>
            <ds:SignatureValue>J01cU0DI0tTs9t5rHiGmdt4QiJGDGnrfINTNI4QYS54BBY3mASJuVc0AK+GKY2E97cFxFd0LONu3BvM9HE2wvw==</ds:SignatureValue>
            <ds:KeyInfo>
              <ds:X509Data>
                <ds:X509Certificate>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</ds:X509Certificate>
              </ds:X509Data>
            </ds:KeyInfo>
          </ds:Signature>
        </ns2:SMEVSignature>
      </ns2:ResponseMessage>
    </ns2:GetResponseResponse>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`

test (id, () => {

	expect (s.getMessageId (xml)).toBe (id)

})

