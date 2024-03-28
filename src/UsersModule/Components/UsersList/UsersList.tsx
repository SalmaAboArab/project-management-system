import { useContext, useEffect, useState } from "react";
import { Watch } from "react-loader-spinner";
import PagesHeader from "../../../SharedMoudule/Components/PagesHeader/PagesHeader";
import Filter from "../../../SharedMoudule/Components/Filter/Filter";
import axios from "axios";
import { baseUrl } from "../../../Constants/Components/Urls";
import { toast } from "react-toastify";
import styles from "./UsersList.module.css/";
import Loading from "../../../SharedMoudule/Components/Loading/Loading";
import { Button, Modal } from "react-bootstrap";
import Pagination from "../../../SharedMoudule/Components/Pagination/Pagination";
import ViewModal from "../../../SharedMoudule/Components/ViewModal/ViewModal";
import noData from "../../../assets/noData.jpeg";
import { AuthContext } from "../../../Context/Components/AuthContext";
import { useNavigate } from "react-router-dom";
export default function UsersList() {
  let { loginData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pagesArray, setPagesArray] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const [usersId, setUsersId] = useState("");
  const [isActivatedUser, setIsActivatedUser] = useState("");
  const [showToggle, setShowToggle] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [pageNum, setPageNum] = useState(1);
  const [showView, setShowView] = useState(false);

  const handleCloseView = () => setShowView(false);
  const handleShowView = () => setShowView(true);

  const handleCloseToggle = () => setShowToggle(false);
  const handleShowToggle = () => setShowToggle(true);

  async function getToggleActivatedEmployee() {
    try {
      const { data } = await axios.put(
        `${baseUrl}/Users/${usersId}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("userToken"),
          },
        }
      );
      getUsersList();
      handleCloseToggle();
      if (data.isActivated) {
        toast.success("Activation done 😍😍");
      } else {
        toast.success("Deactivation done ☹️☹️");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "There was a mistake toggling user activation."
      );
    }
  }

  async function getUsersList() {
    try {
      const data = await axios.get(
        `${baseUrl}/Users?pageSize=10&pageNumber=${pageNum}`,
        {
          headers: {
            Authorization: localStorage.getItem("userToken"),
          },
        }
      );

      setUsersList(data.data.data);
      setPagesArray(
        Array(data.data?.totalNumberOfPages)
          .fill()
          .map((_, i) => i + 1)
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "There's a mistake.");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (loginData?.userGroup === "Manager") {
      getUsersList();
    } else {
      navigate("/dashboard")
    }
  }, [pageNum]);

  //? ===========handle Date==============>>
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const formattedDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;
    return formattedDate;
  };
  return (
    <>
      <div className="container-fluid d-flex flex-column   ">
        <PagesHeader title={"Users"} />
        {!isLoading ? (
          <>
            <Filter setUsersList={setUsersList} />
            {usersList.length > 0 ? (
              <div className="table-responsive w-100">
                <table className="w-100   table text-center">
                  <thead className=" p-4">
                    <tr>
                      <th>UserName</th>
                      <th>Email</th>
                      <th>Statues</th>
                      <th>Phone Number</th>
                      <th>Date Created</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="position-relative">
                    {usersList.map(
                      ({
                        id,
                        userName,
                        email,
                        isActivated,
                        phoneNumber,
                        creationDate,
                      } = user) => (
                        <tr className="tr-info" key={id}>
                          <td>{userName}</td>
                          <td>{email}</td>
                          <td>
                            {isActivated ? (
                              <span className="text-bg-success p-1 rounded-1">
                                Active
                              </span>
                            ) : (
                              <span className="text-bg-danger p-1 rounded-1">
                                No Active
                              </span>
                            )}
                          </td>
                          <td>{phoneNumber}</td>
                          <td>{formatDate(creationDate)}</td>{" "}
                          <td>
                            <div className="dropdown ">
                              <button
                                className="border-0 bg-body"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className=" h5 me-1 fa-solid fa-ellipsis-vertical"></i>
                              </button>
                              <ul
                                className={`${styles.dropBtn} dropdown-menu text-black `}
                              >
                                <li className="position-relative">
                                  <span
                                    className={`${styles.triangle} position-absolute `}
                                  >
                                    <i className="border-1  h2 fa-solid fa-caret-up"></i>
                                  </span>
                                </li>
                                <li>
                                  {" "}
                                  <button
                                    onClick={() => {
                                      setUserDetails({
                                        id,
                                        userName,
                                        email,
                                        isActivated,
                                        phoneNumber,
                                        creationDate,
                                      });
                                      handleShowView();
                                    }}
                                    className="dropdown-item "
                                    type="button"
                                  >
                                    <i className="fa-solid fa-eye me-1 text-success"></i>
                                    View
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => {
                                      setUsersId(id);
                                      setIsActivatedUser(isActivated);
                                      handleShowToggle();
                                    }}
                                    className="dropdown-item "
                                    type="button"
                                  >
                                    {isActivated ? (
                                      <i className="text-danger fa-solid fa-toggle-off me-1"></i>
                                    ) : (
                                      <i className="h5 text-success fa-solid fa-toggle-on me-1"></i>
                                    )}
                                    Toggle
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={10}>
                        <Pagination
                          pageNum={pageNum}
                          setPageNum={setPageNum}
                          pagesArray={pagesArray}
                        />
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="mt-5 text-center">
                <img src={noData} alt="noData" />
              </div>
            )}
          </>
        ) : (
          <div className="  pt-5 mt-5 ">
            <Loading components={1} />
          </div>
        )}
      </div>

      <>
        <Modal
          show={showToggle}
          onHide={handleCloseToggle}
          centered
          keyboard={true}
        >
          <Modal.Header closeButton>
            <Modal.Title>Change employee status</Modal.Title>
          </Modal.Header>
          <Modal.Body className="h5 text-center">
            {isActivatedUser
              ? "Are you sure you want to deactivate this user ?😔"
              : "Are you sure to make this user active ?😍"}
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => getToggleActivatedEmployee()}
              variant={!isActivatedUser ? "success" : "danger"}
            >
              Yes
            </Button>
          </Modal.Footer>
        </Modal>

        <ViewModal
          userDetails={userDetails}
          handleCloseView={handleCloseView}
          showView={showView}
        />
      </>
    </>
  );
}
