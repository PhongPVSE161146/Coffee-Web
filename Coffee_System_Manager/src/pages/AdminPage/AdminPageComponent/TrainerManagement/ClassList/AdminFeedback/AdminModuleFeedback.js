import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './AdminModuleFeedback.css';
import { Card, Collapse, Button, Divider, Rate, Progress } from 'antd';
import { StarFilled } from '@ant-design/icons';
import Loading from '../../../../../../components/Loading/Loading';
import ExclamationCircle from '../../../../../../assets/ExclamationCircle.png';
import { fetchFeedbackStatistic, fetchFeedbackDetail, fetchFeedbackInfo } from '../ApiService/ApiService';
import { showErrorNotification } from '../../../../../../components/Notifications/Notifications';
import dayjs from 'dayjs';
import { Tooltip } from 'antd';

const { Panel } = Collapse;

export const AdminModuleFeedback = () => {
  const { templateId } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const classId = query.get('classId');
  const [loading, setLoading] = useState(true); // Loading state
  const [feedbackData, setFeedbackData] = useState(null); // For overall feedback statistics
  const [detailedFeedback, setDetailedFeedback] = useState([]); // For detailed feedback by rating
  const [feedbackInfo, setFeedbackInfo] = useState(null); // For overall feedback statistics
  const [filterRating, setFilterRating] = useState([]);  // Selected rating for filter (null means show all)
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal state
  const [selectedReason, setSelectedReason] = useState(""); // Store reason for modal
  const [anonymousMap, setAnonymousMap] = useState(new Map());

  // Fetch overall feedback statistics
  useEffect(() => {
    const getFeedbackData = async () => {
      try {
        const response = await fetchFeedbackStatistic(templateId);
        if (response.success) {
          setFeedbackData(response.data[0]);
        } else {
          //console.error('Error: ', response.message);
        }
      } catch (error) {
        //console.error('Error fetching feedback data:', error);
      } finally {
        setLoading(false);
      }
    };
    getFeedbackData();
  }, [templateId]);

  // Fetch detailed feedback for each rating (1-5 stars)
  useEffect(() => {
    const fetchAllRatings = async () => {
      const ratings = [];
      try {

        const data = await fetchFeedbackDetail(templateId);
        if (data.length > 0) {
          ratings.push(...data);
        }

        setDetailedFeedback(ratings);
      } catch (error) {
        //console.error('Error fetching detailed feedback:', error);
      }
    };
    fetchAllRatings();
  }, [templateId]);

  useEffect(() => {
    if (templateId && classId) {
      setLoading(true);
      getFeedbackInfo();
    }
  }, [templateId, classId]);


  const getFeedbackInfo = async () => {
    try {
      const response = await fetchFeedbackInfo(templateId, classId);
      if (response.success) {
        const feedbackData = response.data;

        // Lưu `sentOn` và `expiredAt` vào state
        setFeedbackInfo({
          ...feedbackData,
          classAdmin: feedbackData.classAdmin
            ? feedbackData.classAdmin.replace(/,\s*$/, '')
            : '',
          sentOn: feedbackData.sentOn ? new Date(feedbackData.sentOn) : null,
          expiredAt: feedbackData.expiredAt ? new Date(feedbackData.expiredAt) : null,
        });

      } else {
        showErrorNotification("Error", "Failed to load feedback information");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          showErrorNotification("Schedule Not Found", `Schedule not found for Template ${templateId} and class id=${classId}`);
        } else {
          showErrorNotification("Error Loading Feedback Information", error.response.data.message || error.message);
        }
      } else {
        showErrorNotification("Error Loading Feedback Information", error.message);
      }
    } finally {
      setLoading(false);
    }
  };







  const totalStars = feedbackData?.fiveStar + feedbackData?.fourStar + feedbackData?.threeStar + feedbackData?.twoStar + feedbackData?.oneStar;
  const fivePercent = (feedbackData?.fiveStar / totalStars) * 100;
  const fourPercent = (feedbackData?.fourStar / totalStars) * 100;
  const threePercent = (feedbackData?.threeStar / totalStars) * 100;
  const twoPercent = (feedbackData?.twoStar / totalStars) * 100;
  const onePercent = (feedbackData?.oneStar / totalStars) * 100;


  // Handle filter click
  const handleRatingFilterClick = (rating) => {
    setFilterRating((prev) => {
      if (prev.includes(rating)) {
        // Remove the rating if it is already selected
        return prev.filter((r) => r !== rating);
      } else {
        // Add the rating if it is not selected
        return [...prev, rating];
      }
    });
  };

  const handleDetailsClick = (reason) => {
    setSelectedReason(reason); // Set the reason when clicking "Details"
    setIsModalVisible(true); // Show the modal
  };

  const closeModal = () => {
    setIsModalVisible(false); // Close the modal
    setSelectedReason(""); // Clear the selected reason
  };

  // Display loading spinner if loading
  if (loading) {
    return <Loading />;
  }

  // if (!feedbackData || feedbackData.length === 0) {
  //   return <div className='no-data-feedback'>NO DATA AVAILABLE</div>;
  // }
  const renderClassAdminInfo = (classAdmin) => {
    if (!classAdmin) return 'Unknown';

    if (classAdmin.length > 15) {
      return (
        <Tooltip title={classAdmin} placement="top">
          <span>{`${classAdmin.slice(0, 15)}...`}</span>
        </Tooltip>
      );
    }

    return classAdmin;
  };

  return (
    <div className="feedback-page-big-div">
      {/* Feedback Summary Card */}
      <div className="feedback-class-title">
        <span className="Feedback-for-class">Feedback For Class:</span>{' '}
        <span className="classname-feedback-class-title">
          {feedbackData?.className || 'None'}
        </span>

        <div className="feedback-class-class-info">
          <div className="feedback-class-class-info-left">
            <div>
              <span className='feedback-class-class-info-title'>Class Admin:</span>
              {/* <span className='feedback-class-class-info-detail'>{feedbackInfo?.classAdmin.length > 15 ? `${feedbackInfo?.classAdmin.slice(0, 15)}...` : feedbackInfo?.classAdmin || 'Unknown'}</span> */}
              {/* <h3 className="template-title" title={template.title}>
                  {template.title.length > 25 ? `${template.title.slice(0, 25)}...` : template.title}
                </h3> */}
              <span className='feedback-class-class-info-detail'>{renderClassAdminInfo(feedbackInfo?.classAdmin)}</span>
            </div>
            <div>
              <span className='feedback-class-class-info-title'>Sent On:</span>
              <span className='feedback-class-class-info-detail'>
                {feedbackInfo?.sentOn ? dayjs(feedbackInfo.sentOn).format('DD/MM/YYYY [at] h:mm A') : 'N/A'}
              </span>
            </div>
            <div>
              <span className='feedback-class-class-info-title'>Status:</span>
              <span className='feedback-class-class-info-detail'>
                {feedbackInfo?.expiredAt && dayjs(feedbackInfo.expiredAt).isAfter(dayjs()) ? 'On-Going' : 'Finish'}
              </span>
            </div>
          </div>

          <div className="feedback-class-class-info-right">
            <div>
              <span className='feedback-class-class-info-title'>| Trainer:</span>
              <span className='feedback-class-class-info-detail'>{feedbackInfo?.trainer || 'Unknown'}</span>
            </div>
            <div>
              <span className='feedback-class-class-info-title'>| Expired At: </span>
              <span className='feedback-class-class-info-detail'>
                {feedbackInfo?.expiredAt ? dayjs(feedbackInfo.expiredAt).format('DD/MM/YYYY  [at] h:mm A') : 'N/A'}
              </span>
            </div>
            <div>
              <span className='feedback-class-class-info-title'>| Responses:</span>
              <span className='feedback-class-class-info-detail'>{feedbackInfo?.responses || '0/0'}</span>
            </div>
          </div>
        </div>
      </div>

      <Card className='module-feedback-statistics-container'>
        <div className='card-header'>
          <div className='average-star-container'>
            <h2>Average</h2>
            <span>{feedbackData?.averageRating.toFixed(1) ?? '0'} <StarFilled style={{ color: 'gold' }} /></span>
          </div>

          <div className='star-bar-list'>
            <div className='star-rating-row'>
              <div className='feedback-progress'>
                <Rate disabled defaultValue={5} />
                <Progress className='feedback-progress-bar' percent={fivePercent} strokeColor="gold" showInfo={false} />
                <p>{feedbackData?.fiveStar ?? '0'}</p>
              </div>
              <div className='feedback-progress'>
                <Rate disabled defaultValue={4} />
                <Progress className='feedback-progress-bar' percent={fourPercent} strokeColor="gold" showInfo={false} />
                <p>{feedbackData?.fourStar ?? '0'}</p>
              </div>
              <div className='feedback-progress'>
                <Rate disabled defaultValue={3} />
                <Progress className='feedback-progress-bar' percent={threePercent} strokeColor="gold" showInfo={false} />
                <p>{feedbackData?.threeStar ?? '0'}</p>
              </div>
              <div className='feedback-progress'>
                <Rate disabled defaultValue={2} />
                <Progress className='feedback-progress-bar' percent={twoPercent} strokeColor="gold" showInfo={false} />
                <p>{feedbackData?.twoStar ?? '0'}</p>
              </div>
              <div className='feedback-progress'>
                <Rate disabled defaultValue={1} />
                <Progress className='feedback-progress-bar' percent={onePercent} strokeColor="gold" showInfo={false} />
                <p>{feedbackData?.oneStar ?? '0'}</p>
              </div>
            </div>

          </div>
        </div>
        {/* Rating Filter */}
        <Divider />
        <div className="filter-flex-container">
          <h2>Filter: </h2>
          <ul className="score-list">
            <li><Button onClick={() => handleRatingFilterClick(null)}>All</Button></li>
            {[5, 4, 3, 2, 1].map((rating) => (
              <li key={rating}>
                <Button onClick={() => handleRatingFilterClick(rating)}>
                  {rating} <StarFilled style={{ color: 'gold' }} />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Detailed Feedback Cards */}
      <div className='feedback-content-container'>
        {detailedFeedback.length === 0 ? ( // Check if detailedFeedback is empty
          <div className='no-data-feedback'>NO DATA AVAILABLE</div> // Render this if no data
        ) : (
          <Collapse expandIconPosition="end" className=''>
            {detailedFeedback
              .filter((studentFeedback) => {
                const roundedAverageRating = Math.round(studentFeedback.averageRating);
                return filterRating.length === 0 || filterRating.includes(roundedAverageRating);
              })
              .map((studentFeedback, index) => { // Add index parameter to map
                const roundedAverageRating = Math.round(studentFeedback.averageRating);
                const ratingsBySection = studentFeedback.ratings.reduce((acc, rating) => {
                  if (!acc[rating.sectionName]) {
                    acc[rating.sectionName] = [];
                  }
                  acc[rating.sectionName].push(rating);
                  return acc;
                }, {});

                // Create anonymous label
                const anonymousLabel = `Anonymous ${index + 1}`; // Use index to create "Anonymous X"

                return (
                  <Panel
                    key={studentFeedback.studentId}
                    header={
                      <div className='collapse-header-content'>
                        <div className='collapse-header-content-rating'>
                          <span className='rating'>{roundedAverageRating}</span>
                          <StarFilled className='star-icon' />
                        </div>
                        <div className='collapse-header-content-modtrainer'>
                          {anonymousLabel} {/* Use the anonymous label instead of studentId */}
                        </div>
                      </div>
                    }
                  >
                    {Object.keys(ratingsBySection).map((sectionName) => (
                      <div key={sectionName} className='training-program-comment-container'>
                        <div className='training-program-content-titlebox'>
                          <p>{sectionName}</p>
                        </div>
                        {ratingsBySection[sectionName].map((ratingDetail, index) => (
                          <div key={index} className='trainer-comment-training-program-content-container'>
                            <p>{ratingDetail.question}</p>
                            <div className='progress-step-details'>
                              <Progress
                                className='progress-training-program-content'
                                steps={5}
                                percent={ratingDetail.rating * 20}
                                size={[100, 10]}
                                showInfo={false}
                              />
                              <a onClick={() => handleDetailsClick(ratingDetail.reason)}>Details</a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </Panel>
                );
              })}
          </Collapse>
        )}
      </div>
      {isModalVisible && (
        <>
          <div className='modal-info-backdrop' onClick={closeModal}></div> {/* Backdrop */}
          <div className='modal-info-container'>
            <div className='modal-info-header'>
              <img src={ExclamationCircle} alt='Exclamation Circle' />
              <h3>Problem details</h3>
            </div>
            <div className='modal-info-content'>
              <p>{selectedReason || 'No detail to show.'}</p> {/* Display the reason */}
            </div>
            <button onClick={closeModal}>Done</button>
          </div>
        </>
      )}
    </div>
  );
};
