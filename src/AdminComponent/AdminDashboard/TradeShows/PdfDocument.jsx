import {  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    margin: 10,
    padding: 10,
  },
  section: {
    margin: 5,
    padding: 5,
  },
  header: {
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    marginBottom: 5,
    position: "relative",
    top: "-16px",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    textTransform: "uppercase",
  },
  headerText2: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    textTransform: "uppercase",
  },
  headerText3: {
    fontSize: 11,
    fontWeight: "bold",
    color: "blue",
    textAlign: "center",
  },
  invoiceContainer: {
    display: "flex",
  },
  invoiceInfo: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  customerInfo: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    marginBottom: 5,
    marginRight: 10,
    fontWeight: "bold",
    color: "#000",
  },
  infoText2: {
    fontSize: 12,
    marginBottom: 5,
    marginRight: 10,
    fontWeight: "bold",
    color: "#3e4093",
  },
  Footer: {
    fontSize: 12,
    position: "absolute",
    top: "96%",
    right: "4%",
    marginBottom: 5,
    marginRight: 10,
    fontWeight: "bold",
    color: "#3e4093",
  },
  Header: {
    fontSize: 12,
    position: "absolute",
    top: "1%",
    right: "5%",
    marginBottom: 5,
    marginRight: 10,
    fontWeight: "bold",
    color: "#3e4093",
  },
  table: {
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
  },
  cellHeader: {
    flex: 1,
    fontWeight: "bold",
    padding: 5,
    fontSize: 12,
  },
  cellHeader2: {
    flex: 1,
    fontWeight: "bold",
    padding: 5,
    fontSize: 12,
    textAlign: "start",
    minWidth: "25%",
  },
  cellData: {
    flex: 1,
    padding: 5,
    fontSize: 10,
  },

  cellData2: {
    flex: 1,
    padding: 5,
    fontSize: 10,
    textAlign: "start",
    minWidth: "25%",
  },
  comment: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    borderTopStyle: "solid",
    paddingTop: 10,
  },
  commentText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    textTransform: "uppercase",
  },
  commentData: {
    fontSize: 10,
    color: "#000",
    textAlign: "start",
    padding: 5,
  },
  logoImg: {
    marginBottom: 10,
    width: 80,
    position: "relative",
    top: "-20px",
  },
});

export const PDFDocument = ({ orderData }) => (
  <Document marginLeft={50} marginRight={50} marginTop={50} marginBottom={50}>
    {orderData?.map((itm, index) => (
      <Page key={index} style={styles.page}>
        <Text style={styles.Header}>
          {" "}
          Page No: {itm?.pageNo || 1}
          {" of"}{" "}
          <Text style={styles.infoText}>{Math.ceil(itm?.count / 14)}</Text>
        </Text>

        <View style={styles.section}>
          <View style={styles.logoImg}>
            <Image
              src={require("../../../assets/img/logo.png")}
              alt="Company Logo"
            />
          </View>
          <View style={styles.header}>
            <Text style={styles.headerText}>Star Importers & Wholesalers</Text>
            <Text style={styles.headerText2}>
              2166 Mountain Industrial Blvd, Tucker, GA 30084, United States -
              +1 770-908-0404
            </Text>
            <Text style={styles.headerText3}>www.starimporters.com</Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.infoText}>
              Company Name:{" "}
              <Text style={styles.infoText2}>{itm._id?.companyName},</Text>
            </Text>
            <Text style={styles.infoText}>
              Account Number:{" "}
              <Text style={styles.infoText2}>{itm._id?.account},</Text>,
            </Text>
            <Text style={styles.infoText}>
              Address: <Text style={styles.infoText2}>{itm._id?.address},</Text>
            </Text>
            <Text style={styles.infoText}>
              Phone Number:{" "}
              <Text style={styles.infoText2}>{itm._id?.phoneNumber},</Text>
            </Text>
            <Text style={styles.infoText}>
              Order Id: <Text style={styles.infoText2}>{itm._id.orderId}</Text>
            </Text>

            <Text style={styles.infoText}>
              Order Date:{" "}
              <Text style={styles.infoText2}>
                {moment(itm.updatedAt).format("MM/DD/YYYY")},
              </Text>
            </Text>
            <Text style={styles.infoText}>
              Order Type: <Text style={styles.infoText2}>{itm._id?.type},</Text>
            </Text>
            <Text style={styles.infoText}>
              Total Items: <Text style={styles.infoText2}>{itm.count},</Text>
            </Text>
          </View>
          <View style={styles.customerInfo}></View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.cellHeader}>Order Id</Text>
              <Text style={styles.cellHeader}>Part Number</Text>
              <Text style={styles.cellHeader2}>Description</Text>
              <Text style={styles.cellHeader}>Promotion</Text>
              <Text style={styles.cellHeader}>Ordered</Text>
            </View>
            {itm?.products?.map((item) => (
              <View style={styles.tableRow}>
                <Text style={styles.cellData}>{itm?._id?.orderId}</Text>
                <Text style={styles.cellData}>
                  {item?.productId?.type?.barcode[0]}
                </Text>
                <Text style={styles.cellData2}>
                  {item?.productId?.unitName +
                    "-" +
                    item?.productId?.type?.flavour}
                </Text>
                <Text style={styles.cellData}>
                  {item?.promotionalComment || "No comments"}
                </Text>
                <Text style={styles.cellData}>{item?.quantity}</Text>
              </View>
            ))}
          </View>
          <View style={styles.comment}>
            <Text style={styles.commentText}>Order Comments:</Text>
            <Text style={styles.commentData}>
              {itm._id.comments ? itm._id.comments : "No comments!"}
            </Text>
          </View>
        </View>
      </Page>
    ))}
  </Document>
);
